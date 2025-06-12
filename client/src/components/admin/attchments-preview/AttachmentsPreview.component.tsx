import React, { useState } from 'react';
import classes from './AttachmentsPreview.module.css';
import Button from '../button/Button.component';
import { FileUploader } from 'react-drag-drop-files';
import { formatBytes } from '../../../utils/formatBytes';
import { imageFileTypes } from '../../../utils/imageFileTypes';
import { extensionPreview } from '../../../utils/extensionPreview';
import Spinner from '../../loaders/spinner/Spinner';

interface AttachmentsPreviewProps {
  attachments: {
    id?: string;
    lastModified?: string | number;
    image?: string;
    author?: string;
    name?: string;
    size?: number | any;
  }[];
  onDownload?: (file?: any) => void;
  onDeleteCover?: (file?: any) => void;
  onDeleteAttachment?: (file?: any) => void;
  onDrop?: (item: any) => void;
  onAdd?: () => void;
  inProgress?: boolean;
  onChange?: any;
  coverImage?: any;
  showDownload?: boolean;
  attachmentDeleteLoading?: boolean;
}

const AttachmentsPreview = ({
  attachments,
  onDownload,
  onDrop,
  onAdd,
  inProgress,
  onChange,
  coverImage,
  onDeleteCover,
  onDeleteAttachment,
  attachmentDeleteLoading,
  showDownload = true,
}: AttachmentsPreviewProps) => {
  const coverFileType = extensionPreview(coverImage?.name);
  return (
    <div className={classes.container}>
      {coverImage && (
        <div key={coverImage?.lastModified} className={classes.prevItem}>
          <div className={classes.left}>
            <img className={classes.image} src={coverFileType} crossOrigin='anonymous' />
            <div className={classes.names}>
              <span className={classes.name}>{coverImage?.name}</span>
            </div>
          </div>
          <div>
            <span className={classes.size}>{formatBytes(coverImage?.size)}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span
              onClick={() => onDeleteCover?.(coverImage)}
              className={classes.download}
              style={{ color: 'red' }}
            >
              Delete
            </span>
            <span onClick={() => onDownload?.(coverImage?.name)} className={classes.download}>
              Download
            </span>
          </div>
        </div>
      )}
      {attachments?.map((attach) => {
        const fileType = extensionPreview(attach?.name);
        return (
          <div key={`${attach.lastModified} ${attach.name}`} className={classes.prevItem}>
            <div className={classes.left}>
              <img className={classes.image} src={fileType} crossOrigin='anonymous' />
              <div className={classes.names}>
                <span className={classes.name}>{attach.name}</span>
                {/* <span className={classes.author}>{attach.author}</span> */}
              </div>
            </div>
            <div>
              <span className={classes.size}>{formatBytes(attach?.size)}</span>
            </div>
            <div style={{ display: 'flex' }}>
              {attachmentDeleteLoading ? (
                <Spinner size='13px' />
              ) : (
                <span
                  onClick={() => onDeleteAttachment?.(attach)}
                  className={classes.download}
                  style={{ color: 'red' }}
                >
                  Delete
                </span>
              )}

              {showDownload && (
                <span onClick={() => onDownload?.(attach)} className={classes.download}>
                  Download
                </span>
              )}
            </div>
          </div>
        );
      })}
      <FileUploader
        handleChange={onChange}
        onDrop={onDrop}
        name='file'
        types={imageFileTypes}
        classes={classes.dragDrop}
      >
        <span className={classes.chooseFile}>Choose a file from device</span>
      </FileUploader>
    </div>
  );
};

export default AttachmentsPreview;
