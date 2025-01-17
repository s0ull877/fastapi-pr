import { page_content } from "./data"
import './Info.css'
import AxeSVG from '../Axe'
import AxeReverse from '../../assets/Info/axe-reverse.svg'
import { Link } from "react-router-dom";

export default function Info({ body }) {

    const page_data = page_content[body]

    return (
            <div className="popup">
            <div className="inner">
                <h1 className="title">
                    <span>
                        <img src={AxeReverse} alt="" />
                    </span>
                    <span>{page_data.title}</span>
                    <span>
                        <span>
                            <AxeSVG width='40' height='40'></AxeSVG>
                        </span>
                    </span>
                </h1>
                { page_data.paragraphs.map(paragraph =>
                        <>
                            <h2 key={paragraph.subtitle} className="subtitle">{paragraph.subtitle}</h2>
                            <p key={paragraph.information} className="information">{paragraph.information}</p>
                        </>
                    ) 
                } 
                <Link className="back" to="/">Назад</Link>
            </div>
        </div>
    )
}