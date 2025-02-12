import styles from "./Post.module.css";

import LikeSVG from '../../assets/Post/like.svg'
import CommentSVG from '../../assets/Post/comment.svg'
import Cross from '../../assets/Post/cross.svg'

import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/AuthStore";
import moment from 'moment';

import { fetchWithAccess } from '../../utils/fetchWithAuth'


export default function Post ({ post, onDelete })  {
    const authStore = useAuthStore();
    
    const mediaItems = post.images.map(image => (
        
        <div className={styles.media_item} key={image}>
            <a href={image}>
                <img src={image} alt="" />
            </a>
        </div>
    ));
    
    function DeleteRequest(e) {

        async function fetchData() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/post/${post.id}`, authStore, {
                method: 'DELETE',
            })
    
            if (response.status === 204) {
                onDelete(post.id)
            }
        }

        fetchData()
    }
    
    return (
        <>
            <li className={styles.post_item}>
                <div className={styles.post}>
                    <div className={styles.post_head}>
                        <div className={`${styles.post_owner_pic} ${styles.cyrcle}`}>
                            <img className={styles.cyrcle_inner} src={ post.owner.image ? post.owner.image : DefaultAvatar} alt="post-profile-photo"/>
                        </div>
                        <div className={styles.post_head_links}>
                            <Link className={styles.post_owner} to={`/profile/${post.owner.username}`}>{post.owner.username}</Link>
                            <Link className={styles.post_category} to={`/feed?ctg=${post.category.slug}`}>{post.category.name}</Link>
                        </div>
                        <span className={styles.post_time}>
                            {moment(post.created_at).fromNow()}
                        </span>
                    </div>
                    <div className={styles.media_post_data}>
                        {mediaItems}
                    </div>
                    <div className={styles.text_post_data}>
                        {post.text}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div className={styles.other_post_data}>
                            <button type="button" className={styles.post_like}>
                                200
                                <img src={LikeSVG} alt="" />
                            </button>
                            <Link className={styles.post_comments_button} to={`/${post.owner.username}/post/${post.id}`}>
                                200
                                <img src={CommentSVG} alt="" />
                            </Link>
                        </div>
                        { post.owner.username === authStore.user.username &&
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
