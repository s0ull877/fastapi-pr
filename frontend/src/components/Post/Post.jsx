import styles from "./Post.module.css";

import LikeSVG from '../../assets/Post/like.svg'
import CommentSVG from '../../assets/Post/comment.svg'

import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'
import { Link } from "react-router-dom";




export default function Post ({ post })  {
    
    const mediaItems = post.images.map(image => (
        
        <div className={styles.media_item} key={image}>
            <a href={image}>
                <img src={image} alt="" />
            </a>
        </div>
    ));
    
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
                            {post.created_at}
                        </span>
                    </div>
                    <div className={styles.media_post_data}>
                        {mediaItems}
                    </div>
                    <div className={styles.text_post_data}>
                        {post.text}
                    </div>
                    <div className={styles.other_post_data}>
                        <button type="button" className={styles.post_like}>
                            200
                            <img src={LikeSVG} alt="" />
                        </button>
                        <a className={styles.post_comments_button} href="./post.html">
                            200
                            <img src={CommentSVG} alt="" />
                        </a>
                    </div>
                </div>
            </li>
        </>
    )
}
