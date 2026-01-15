import { useState } from "react";
import "./ReadMore.css";

export default function ReadMore({ text, maxHeight = 120 }) {
    const [expanded, setExpanded] = useState(false);

    return (
    <div className="read-more-wrapper">
        <div
        className={`read-more-content ${expanded ? "expanded" : ""}`}
        style={{ maxHeight: expanded ? "none" : maxHeight }}
        >
        {text}

        {!expanded && <div className="fade-overlay" />}
        </div>


        <button
        className="read-more-btn"
        onClick={() => setExpanded(!expanded)}
        >
        {expanded ? "Read Less" : "Read More"}
        </button>
    </div>
    );
}
