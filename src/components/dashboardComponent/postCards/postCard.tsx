import React, { useState, forwardRef, useEffect } from "react";
import styles from "./postCard.module.scss";
import Image from "next/image";
import convertDateToRelative from "@/utils/convertDateToRelativeTime";
import { fetchError } from "@/app/lib/exceptions";
import axios from "axios";
import Link from "next/link";

// sub-components:
import EditPostField from "./editPostField/editPostField";
import Comment from "../comments/comments";

import { Prisma } from "@prisma/client";

// Type Definitions:
const commentWithAuthor = Prisma.validator<Prisma.CommentsArgs>()({
  select: {
    id: true,
    createdAt: true,
    comment: true,
    postId: true,
    author: true,
    authorId: true,
  },
});
type CommentWithAuthor = Prisma.PostsGetPayload<typeof commentWithAuthor>;

type postCardProps = {
  id: number;
  postBody: string | null;
  createdAt: Date;
  authorId: number;
  authorUserName: string | null;
  authorPersona: string | null;
  authorJobTitle: string | null;
  authorCompany: string | null;
  loggedInUserId: number;
  imageSrc: string;
  videoSrc: string;
  setError: Function;
  setIsError: Function;
  profilePicture: string | null;
};

const PostCard = forwardRef<HTMLDivElement, postCardProps>(function PostCard(
  {
    id,
    postBody,
    createdAt,
    authorId,
    authorUserName,
    authorPersona,
    authorJobTitle,
    authorCompany,
    loggedInUserId,
    imageSrc,
    videoSrc,
    setError,
    setIsError,
    profilePicture,
  }: postCardProps,
  ref
) {
  const [isEditing, setIsEditing] = useState<{
    isEditing: boolean;
    type: string;
    originalComment: string;
    commentId: number | null;
  }>({
    isEditing: false,
    type: "",
    originalComment: "",
    commentId: null,
  });
  const [isImagePresent, setIsImagePresent] = useState(false);
  const [isVideoPresent, setIsVideoPresent] = useState(false);
  const [collapsedPostBody, setCollapsedPostBody] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [length, setLength] = useState<number>();
  const [commentsArr, setCommentsArr] = useState<CommentWithAuthor[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleEditingState = (
    type: string,
    originalComment: string,
    commentId: number | null
  ) => {
    setIsEditing({
      isEditing: !isEditing.isEditing,
      type: type,
      originalComment: originalComment,
      commentId: commentId,
    });
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setIsLoading(true);
    if (imageSrc.length !== null) {
      if (imageSrc.length > 0) setIsImagePresent(true);
    }
    if (videoSrc !== null) {
      if (videoSrc.length) setIsVideoPresent(true);
    }
    if (postBody) {
      if (postBody?.length >= 38) {
        setCollapsedPostBody(`${postBody?.substring(0, 38)}`);
        setIsCollapsed(true);
        setLength(postBody?.length);
      } else {
        setCollapsedPostBody(postBody);
        setIsCollapsed(true);
        setLength(postBody?.length);
      }
    }

    axios
      .get(`/api/comments/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setCommentsArr(res.data.data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (
          error.response.status === 404 ||
          error.response.status === 500 ||
          error.status === 400 ||
          error.status === 500
        ) {
          setError(new fetchError());
          setIsError(true);
          setIsLoading(false);
        }
      });
  }, [imageSrc, videoSrc, postBody, id, setError, setIsError]);

  const insertSeeMoreBtn = () => {
    if (!postBody || (length && length < 38)) return;
    return (
      <p
        className={`${styles.readMore} ${styles.toggleBtn}`}
        onClick={toggleCollapsed}
      >
        {isCollapsed ? "Read More" : "Read Less"}
      </p>
    );
  };

  const deletePost = async (postId: number) => {
    const id = postId;
    axios
      .delete(`/api/posts/${id}`)
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        } else {
          setError(new fetchError());
          setIsError(true);
        }
      })
      .catch((error) => {
        if (
          error.response.status === 404 ||
          error.response.status === 500 ||
          error.status === 400 ||
          error.status === 500
        ) {
          setError(new fetchError());
          setIsError(true);
        }
      });
  };

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.postingUserInfo}>
        <Link className={styles.link} href={`/dashboard/profile/${authorId}`}>
          <div className={styles.leftSection}>
            <Image
              className={styles.profilePicture}
              src={
                profilePicture
                  ? profilePicture
                  : "https://res.cloudinary.com/dvz91qyth/image/upload/v1693247245/Nomex/dashboard/earth-with-thin-waves-pattern_katll8.png"
              }
              width={60}
              height={60}
              alt="google"
            />
            <div className={styles.secondaryLeftSection}>
              <p className={styles.userName}>{authorUserName}</p>
              <p className={styles.persona}>{authorPersona}</p>
              <p className={styles.job}>
                {authorJobTitle} at {authorCompany}
              </p>
            </div>
          </div>
        </Link>
        <div className={styles.rightSection}>
          <p className={styles.timePast}>{convertDateToRelative(createdAt)}</p>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.postTools}>
          {isEditing.isEditing &&
            isEditing.type !== "post" &&
            authorId !== loggedInUserId && (
              <Image
                className={styles.editIcon}
                src="https://res.cloudinary.com/dvz91qyth/image/upload/v1693421983/Nomex/dashboard/delete_lzxfe3.png"
                width={20}
                height={20}
                alt="stop-edit"
                onClick={() => toggleEditingState("", "", null)}
              />
            )}
          {authorId === loggedInUserId && (
            <>
              {isEditing.isEditing ? (
                <Image
                  className={styles.editIcon}
                  src="https://res.cloudinary.com/dvz91qyth/image/upload/v1693421983/Nomex/dashboard/delete_lzxfe3.png"
                  width={20}
                  height={20}
                  alt="stop-edit"
                  onClick={() => toggleEditingState("", "", null)}
                />
              ) : (
                <>
                  <Image
                    className={styles.editIcon}
                    src="https://res.cloudinary.com/dvz91qyth/image/upload/v1693418958/Nomex/dashboard/editing_btgzy6.png"
                    width={20}
                    height={20}
                    alt="edit"
                    onClick={() => toggleEditingState("post", "", null)}
                  />
                  <Image
                    className={styles.deleteIcon}
                    onClick={() => deletePost(id)}
                    src="https://res.cloudinary.com/dvz91qyth/image/upload/v1693419097/Nomex/dashboard/trash_pglfuc.png"
                    width={20}
                    height={20}
                    alt="delete"
                  />
                </>
              )}
            </>
          )}
        </div>
        <div
          className={`${
            isImagePresent
              ? styles.transitionContainerWithImg
              : styles.transitionContainerWithOutImg
          } ${isEditing.isEditing ? styles.isEditingPost : ""} ${
            isCollapsed ? "" : styles.expanded
          }`}
        >
          {!isEditing.isEditing ? (
            <div className={styles.postBodyContainer}>
              <div
                className={`${styles.postContainer} ${
                  isCollapsed ? "" : styles.expanded
                }`}
              >
                <div className={styles.bodyContainer}>
                  {isCollapsed ? (
                    <p className={styles.body}>{collapsedPostBody}</p>
                  ) : (
                    <p className={styles.body}>{postBody}</p>
                  )}
                  {insertSeeMoreBtn()}
                  {isImagePresent && (
                    <div className={styles.imgContainer}>
                      <Image
                        className={styles.postImg}
                        src={imageSrc}
                        fill={true}
                        // width={450}
                        // height={450}
                        alt="post-img"
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* <div>LIKE ICON HERE</div> */}
              <div className={styles.commentSlash} />
              <div className={styles.addCommentContainer}>
                <Image
                  className={styles.editIcon}
                  src="https://res.cloudinary.com/dvz91qyth/image/upload/v1694561831/Nomex/dashboard/instagram-post_1_zdvwpa.png"
                  width={40}
                  height={40}
                  alt="stop-edit"
                  onClick={() => toggleEditingState("addComment", "", null)}
                />
              </div>
              {commentsArr.length > 0 ? (
                <div className={styles.commentScrollContainer}>
                  {commentsArr?.map((item, index) => (
                    <Comment
                      key={index}
                      id={item.id}
                      authorId={item.authorId}
                      postId={item.postId}
                      createdAt={item.createdAt}
                      authorName={item?.author?.userName}
                      authorPersona={item.author.persona}
                      authorJobTitle={item.author.jobTitle}
                      authorCompanyName={item.author.companyName}
                      profilePicture={item.author.profilePicture}
                      comment={item.comment}
                      loggedInUserId={loggedInUserId}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      isEditing={isEditing}
                      toggleEditingState={toggleEditingState}
                      setError={setError}
                      setIsError={setIsError}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <EditPostField
              postId={id}
              postBeforeEdit={postBody}
              setError={setError}
              setIsError={setIsError}
              isEditing={isEditing}
              loggedInUserId={loggedInUserId}
            />
          )}
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = "PostCard";

export default PostCard;
