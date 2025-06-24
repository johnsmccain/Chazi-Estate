import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, FileText, X } from 'lucide-react';

interface FileUploadProps {
  type: 'images' | 'documents';
  files: string[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  files,
  onFileUpload,
  onFileRemove
}) => {
  const isImages = type === 'images';
  const Icon = isImages ? Camera : FileText;
  const accept = isImages ? 'image/*' : '.pdf,.doc,.docx';
  const title = isImages ? 'Property Images' : 'Legal Documents';
  const description = isImages 
    ? 'Upload beautiful photos of your property 📸'
    : 'Upload deeds, titles, and other legal documents 📄';
  const buttonText = isImages ? 'Select Images' : 'Select Documents';
  const buttonColor = isImages 
    ? 'from-purple-500 to-pink-600' 
    : 'from-emerald-500 to-blue-600';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {title}
      </label>
      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-white/5">
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-4">{description}</p>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={onFileUpload}
          className="hidden"
          id={`${type}-upload`}
        />
        <label
          htmlFor={`${type}-upload`}
          className={`bg-gradient-to-r ${buttonColor} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 cursor-pointer inline-flex items-center space-x-2`}
        >
          <Upload className="h-4 w-4" />
          <span>{buttonText}</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className={isImages ? "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4" : "space-y-2 mt-4"}>
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={isImages ? "relative group" : "flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10"}
            >
              {isImages ? (
                <>
                  <img
                    src={file}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onFileRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-medium">{file}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onFileRemove(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};