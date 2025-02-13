import styles from "./Post.module.css";

import LikeSVG from '../../assets/Post/like.svg'
import CommentSVG from '../../assets/Post/comment.svg'
import Cross from '../../assets/Post/cross.svg'

import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/AuthStore";
import moment from 'moment';

import { fetchWithAccess } from '../../utils/fetchWithAuth'
import { useState } from "react";


export default function Post ({ post, onDelete })  {
    const authStore = useAuthStore();
    const [postInner, setPostInner] = useState(post)
    // console.log(postInner)
    
    const mediaItems = postInner.images.map(image => (
        
        <div className={styles.media_item} key={image}>
            <a href={image}>
                <img src={image} alt="" />
            </a>
        </div>
    ));

    
    function DeleteRequest(e) {

        async function fetchData() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/post/${postInner.id}`, authStore, {
                method: 'DELETE',
            })
    
            if (response.status === 204) {
                onDelete(postInner.id)
            }
        }

        fetchData()
    }

    async function LikeClick(e) {
        try {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/post/${postInner.id}/like`, authStore, {
                method: 'POST',
            })
    
            if (response.status === 204) {
                setPostInner({
                    ...postInner,
                    liked: false,
                    likes_count: postInner.likes_count -1
                })
            } else if (response.status === 201) {
                setPostInner({
                    ...postInner,
                    liked: true,
                    likes_count: postInner.likes_count + 1
                })
            }
        } catch(err) {
            console.log(err)
        }
    }
    
    return (
        <>
            <li className={styles.post_item}>
                <div className={styles.post}>
                    <div className={styles.post_head}>
                        <div className={`${styles.post_owner_pic} ${styles.cyrcle}`}>
                            <img className={styles.cyrcle_inner} src={ postInner.owner.image ? postInner.owner.image : DefaultAvatar} alt="post-profile-photo"/>
                        </div>
                        <div className={styles.post_head_links}>
                            <Link className={styles.post_owner} to={`/profile/${postInner.owner.username}`}>{postInner.owner.username}</Link>
                            <Link className={styles.post_category} to={`/feed?ctg=${postInner.category.slug}`}>{postInner.category.name}</Link>
                        </div>
                        <span className={styles.post_time}>
                            {moment(postInner.created_at).fromNow()}
                        </span>
                    </div>
                    <div className={styles.media_post_data}>
                        {mediaItems}
                    </div>
                    <div className={styles.text_post_data}>
                        {postInner.text}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div className={styles.other_post_data}>
                            <button onClick={LikeClick} type="button" className={postInner.liked ? `${styles.post_like} ${styles.liked}` : styles.post_like}>
                                {postInner.likes_count}
                                <img src={LikeSVG} alt="" />
                            </button>
                            <Link className={styles.post_comments_button} to={`/${postInner.owner.username}/post/${postInner.id}`}>
                                {postInner.comment_count}
                                <img src={CommentSVG} alt="" />
                            </Link>
                        </div>
                        { postInner.owner.username === authStore.user.username &&
                            <div style={{cursor: 'pointer'}} onClick={DeleteRequest}>
                                <img width='22px' src={Cross} alt="" />
                            </div>
                        }
                    </div>
                </div>
            </li>
        </>
    )
}
