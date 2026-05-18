import React from 'react';

const CommentItem = ({ comment, onReply }) => {
  return (
    <div className="border-start ms-4 ps-3 mt-3 shadow-sm p-2 bg-light">
      <div className="d-flex justify-content-between">
        <strong>{comment.userName}</strong>
        <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
      </div>
      <div className="mt-2" dangerouslySetInnerHTML={{ __html: comment.content }} />
      
      {comment.filePath && (
        <div className="mt-2">
           <a href={`https://localhost:7235${comment.filePath}`} target="_blank" rel="noreferrer">View file</a>
        </div>
      )}

      <button 
        className="btn btn-sm btn-link p-0 mt-1" 
        onClick={() => onReply(comment.id, comment.userName)}
      >
        Answer
      </button>

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;