import React, { useState, useEffect } from 'react';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {


     useEffect(() => {
          const html = props.content;
          // 刷新的时候，因为本来NewAdd写的时候不需要传任何属性（NewsUpdate复用功能），所以刷新时候就算不传props.content，也会走下面代码，即找不到props.content会报错
          if (html === undefined) return;
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
               const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
               const editorState = EditorState.createWithContent(contentState);
               setEditorState(editorState)
          }
     }, [props.content])

     const [editorState, setEditorState] = useState("")
     return (
          <div>
               {/* 富文本编辑器 */}
               <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(editorState) => setEditorState(editorState)}

                    onBlur={() => {
                         // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                         props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    }}
               />;
          </div>
     )
}
