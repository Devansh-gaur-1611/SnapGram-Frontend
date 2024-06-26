import React, { useState, useRef, useCallback } from "react";
import Post from "../Post/Post";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setNextToken, getPost } from "../../features/Post/PostSlice";
import Loader_small from "../Loader/Loader_small";
import { GetAuthRequest } from "../../helper/authRequest";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
  const dispatch = useDispatch();
  const postSlice = useSelector(getPost);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const lastPost = useCallback(
    (node) => {
      // console.log(hasMore);
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // console.log("visible");
          getPosts();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore]
  );
  React.useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    const successFxn = (response) => {
      console.log(response);
      dispatch(setNextToken(response.data.nextToken));
      dispatch(setPost(postSlice.posts.concat(response.data.posts)));
      if (response.data.posts.length < 6) {
        setHasMore(false);
      } else {
        console.log("hi");
        setHasMore(true);
      }
    };
    if (postSlice.nextToken !== 0) GetAuthRequest("api/post/allPost/?size=6&nextToken=" + postSlice.nextToken, successFxn, enqueueSnackbar, navigate,setLoading);
    else{
      GetAuthRequest("api/post/allPost/?size=6", successFxn, enqueueSnackbar, navigate, setLoading);
    }
  };
  return (
    <div className={styles.main_container}>
      {postSlice &&
        postSlice.posts.map((post, index) => {
          if (postSlice.posts.length === index + 1) {
            return (
              <div key={post.postId} ref={lastPost}>
                <Post
                  postId={post.postId}
                  username={post.userName}
                  likes={post.postLikesCount}
                  src={post.postFileUrl}
                  postType={post.postType}
                  status={post.status}
                  commentCount={post.postCommentCount}
                  createdAt={post.createdAt}
                  slug={post.slug}
                  profileimage={post.userImage}
                />
              </div>
            );
          } else {
            return (
              <Post
                key={post.postId}
                postId={post.postId}
                username={post.userName}
                likes={post.postLikesCount}
                src={post.postFileUrl}
                postType={post.postType}
                status={post.status}
                commentCount={post.postCommentCount}
                createdAt={post.createdAt}
                slug={post.slug}
                profileimage={post.userImage}
              />
            );
          }
        })}
      {loading && <Loader_small />}
    </div>
  );
};

export default MainPage;
