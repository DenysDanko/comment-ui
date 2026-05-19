import React, { useState } from 'react';
import FsLightbox from 'fslightbox-react';

const CommentItem = ({ comment, onReply }) => {
  const [toggler, setToggler] = useState(false);
  const isImage = comment.filePath?.match(/\.(jpg|jpeg|png|gif)$/i);
  const BASE_URL = "https://localhost:7235";

  return (
    <div className="card mt-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center border-bottom bg-body-secondary p-3">
        <div>
          <span className="fw-bold text-dark">{comment.userName}</span>
          <span className="text-muted ms-2 small">{comment.email}</span>
        </div>
        <small className="text-secondary">
          <i className="bi bi-clock"></i> {new Date(comment.createdAt).toLocaleString()}
        </small>
      </div>

      <div className="p-3">
        <div className="mt-2 comment-text" dangerouslySetInnerHTML={{ __html: comment.content }} />

        {comment.filePath && (
          <div className="mt-2">
            {isImage ? (
              <>
                <img 
                  src={`${BASE_URL}${comment.filePath}`} 
                  alt="attachment" 
                  className="img-thumbnail" 
                  style={{ maxWidth: '150px', cursor: 'pointer' }}
                  onClick={() => setToggler(!toggler)}
                />
                <FsLightbox
                  toggler={toggler}
                  sources={[`${BASE_URL}${comment.filePath}`]}
                />
              </>
            ) : (
              <a href={`${BASE_URL}${comment.filePath}`} target="_blank" rel="noreferrer" 
                 className="btn btn-sm btn-outline-info d-flex align-items-center gap-2">
                <i className="bi bi-file-earmark-text"></i> File
              </a>
            )}
          </div>
        )}

        <div className="mt-2">
          <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" 
                  onClick={() => onReply(comment.id, comment.userName)}>
            <i className="bi bi-reply-fill"></i> Reply
          </button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies ms-4">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;