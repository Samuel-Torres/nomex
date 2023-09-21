"use client";
import styles from "./comments.module.scss";
import Image from "next/image";
import convertDateToRelative from "@/utils/convertDateToRelativeTime";
import axios from "axios";
import { fetchError } from "@/app/lib/exceptions";
import { KeyedMutator } from "swr";

// components:
import BallSpinner from "@/components/loadingStateComponents/ballSpinner";
import Link from "next/link";

type commentProps = {
  id: number;
  authorId: number;
  postId: number;
  createdAt: string;
  authorName: string | null;
  authorPersona: string | null;
  authorJobTitle: string | null;
  authorCompanyName: string | null;
  profilePicture: string | null;
  comment: string;
  loggedInUserId: number;
  isEditing: {
    isEditing: boolean;
    type: string;
  };
  toggleEditingState: Function;
  setError: Function;
  setIsError: Function;
  isLoading: boolean;
  commentMutate: KeyedMutator<any>;
};

const Comments = ({
  id,
  authorId,
  postId,
  createdAt,
  authorName,
  authorPersona,
  authorJobTitle,
  authorCompanyName,
  profilePicture,
  comment,
  loggedInUserId,
  isEditing,
  toggleEditingState,
  setError,
  setIsError,
  isLoading,
  commentMutate,
}: commentProps) => {
  const deleteComment = () => {
    console.log("RAN");
    axios
      .delete(`/api/comments/${id}`)
      .then((response: any) => {
        if (response.status === 200) {
          commentMutate(`/api/comments/${id}`);
        } else {
          setError(new fetchError());
          setIsError(true);
        }
      })
      .catch((err: any) => {
        console.log("ERROR: ", err);
        if (
          err.response.status === 404 ||
          err.response.status === 500 ||
          err.status === 400 ||
          err.status === 500
        ) {
          setError(new fetchError());
          setIsError(true);
        }
      });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <BallSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.userInfoContainer}>
        <div className={styles.userSection}>
          <Image
            className={styles.profilePicture}
            src={
              profilePicture
                ? profilePicture
                : "https://res.cloudinary.com/dvz91qyth/image/upload/v1693247245/Nomex/dashboard/earth-with-thin-waves-pattern_katll8.png"
            }
            // src=""
            width={50}
            height={50}
            alt="profile"
          />
          <Link className={styles.link} href={`/dashboard/profile/${authorId}`}>
            <div>
              <p className={styles.userInfo}>{authorName}</p>
              <p className={styles.userInfo}>{authorPersona}</p>
              <p className={styles.userInfo}>
                {authorJobTitle} at {authorCompanyName}
              </p>
            </div>
          </Link>
        </div>
        <div className={styles.commentIconConatiner}>
          {loggedInUserId === authorId && (
            <div className={styles.icons}>
              <Image
                className={styles.profilePicture}
                src="https://res.cloudinary.com/dvz91qyth/image/upload/v1693418958/Nomex/dashboard/editing_btgzy6.png"
                width={20}
                height={20}
                alt="google"
                onClick={() => {
                  toggleEditingState("comment", comment, id);
                }}
              />
              <Image
                className={styles.commentIcon}
                src="https://res.cloudinary.com/dvz91qyth/image/upload/v1693419097/Nomex/dashboard/trash_pglfuc.png"
                width={20}
                height={20}
                alt="google"
                onClick={deleteComment}
              />
            </div>
          )}
          <p className={styles.timePosted}>
            {convertDateToRelative(new Date(createdAt))}
          </p>
        </div>
      </div>
      <div className={styles.commentContainer}>
        <p>{comment}</p>
      </div>
      <div className={styles.engagementPanel}>
        <p className={styles.engagement}>like</p>
        <p className={styles.engagement}>reply</p>
      </div>
    </div>
  );
};

export default Comments;
