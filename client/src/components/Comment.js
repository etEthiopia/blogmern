import React from 'react';


const ArticleComment = (comment) => {
    return (
        <div>
            <div className="comment mt-4 text-justify float-left">
                <img src="https://www.kindpng.com/picc/m/173-1731325_person-icon-png-transparent-png.png" alt="" className="rounded-circle" width="30" height="30" />
                <h4 className='commentName'>{comment.author_full_name}</h4>
                <span>{new Date(comment.timestamp).toDateString()}</span>
                <br />
                <p>{comment.body}</p>
            </div>
        </div>
    );
};

export default ArticleComment;