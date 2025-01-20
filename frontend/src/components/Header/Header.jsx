import styles from "./Header.module.css";
import HeaderLogo from '../../assets/Header/header_logo.svg'
import SearchSVG from '../../assets/Header/search.svg'
import { Link } from "react-router-dom";



export default function Header () {
    return (
        <>
            <header className={styles.center}>
                <ul className={styles.header_list}>
                    <li className={styles.header_item}>
                        <Link to="/">
                            <img src={HeaderLogo} alt="" />
                        </Link>
                    </li>
                    <li className={styles.header_item}>
                        <div className={styles.search_box}>
                            <label className={styles.search_box_view}>
                                <img src={SearchSVG} alt="" />
                                <input type="search" placeholder="Поиск" id="search_header"/>
                            </label>
                        </div>
                    </li>
                </ul>
            </header>
        </>
    )
}