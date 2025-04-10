import React from "react";
/* libs */
import Linkify from 'react-linkify';
// import Highlighter from "react-highlight-words";
import ReactHtmlParser from 'react-html-parser';
import { findAll } from "highlight-words-core";

/**
 * @param text string
 * @param isLinkify Boolean default true (library: react-linkify)
 * @param isHighlight Boolean default false (library: react-highlight-words or highlight-words-core)
 * @param caseSensitive Boolean default false (library: react-highlight-words or highlight-words-core)
 * @param searchWords string or array (library: react-highlight-words or highlight-words-core)
 * @param className string
 * @param linkifyClassName string default "btn-text-blue"
 * @param highlightClassName string default "bg-transparent text-sky-blue fw-bold"
 * @param initial string
 * 
 * @returns Component
 * 
 * @example
 * import DisplayText from "@/components/layout/DisplayText";
 * 
 * <DisplayText text="ข้อความ" />
 * 
 * @website react-linkify https://tasti.github.io/react-linkify/
 * @website react-highlight-words or highlight-words-core https://bvaughn.github.io/react-highlight-words/
 */
const DisplayText = ({
    text = '',
    isLinkify = true,
    isHighlight = false,
    caseSensitive = false,
    searchWords, /* string|array */
    className = "",
    linkifyClassName = '',
    highlightClassName = 'bg-transparent text-pink fw-bold',
    initial = ''
}) => {

    const handleGethighlightedText = (textToHighlight, searchWords) => {
        const chunks = findAll({ searchWords, textToHighlight, caseSensitive });
        const highlightedText = chunks?.map(chunk => {
            const { end, highlight, start } = chunk;
            const text = textToHighlight?.substr(start, end - start);
            if (highlight) {
                return `<mark class="${highlightClassName}">${text}</mark>`;
            }
            else {
                return text;
            }
        }).join("");
        return highlightedText;
    }

    /* functions */
    const handleGetSearchWords = (words) => {
        let result = [];
        if (Array.isArray(words)) {
            if (words.length > 0) {
                result = words;
            }
        }
        else {
            result = [words?.trim()];
        }
        return result;
    }
    return (<>
        {(() => {
            if (text || text === 0) {
                if (isLinkify && isHighlight) {
                    return (
                        <span className={className}>
                            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                                <a target="blank" href={decoratedHref} key={key} className={linkifyClassName}>
                                    {decoratedText}
                                </a>
                            )}>
                                {ReactHtmlParser(handleGethighlightedText(text, handleGetSearchWords(searchWords)))}
                            </Linkify>
                        </span>
                    )
                }
                else if (isLinkify && !isHighlight) {
                    return (
                        <span className={className}>
                            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                                <a target="blank" href={decoratedHref} key={key} className={linkifyClassName}>
                                    {decoratedText}
                                </a>
                            )}>
                                {ReactHtmlParser(text?.toString())}
                            </Linkify>
                        </span>
                    )
                }
                else if (!isLinkify && isHighlight) {
                    return <span className={className}>{ReactHtmlParser(handleGethighlightedText(text, handleGetSearchWords(searchWords)))}</span>
                }
                else {
                    return <span className={className}>{ReactHtmlParser(text?.toString())}</span>
                }
            }
            else {
                return <span className={className}>{initial}</span>
            }
        })()}
    </>)
}
export default DisplayText;
