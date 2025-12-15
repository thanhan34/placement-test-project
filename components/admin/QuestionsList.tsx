import React from 'react';
import { Question } from '../../types/placement-test';

interface QuestionsListProps {
  questions: Question[];
  loading: boolean;
}

const QuestionsList: React.FC<QuestionsListProps> = ({ questions, loading }) => {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'readAloud':
        return 'Read Aloud';
      case 'rwfib':
        return 'Reading & Writing: Fill in the Blanks';
      case 'rfib':
        return 'Reading: Fill in the Blanks';
      case 'wfd':
        return 'Write From Dictation';
      default:
        return type;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-[#fedac2]';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-[#fc5d01] border-solid rounded-full animate-spin"></div>
          <span className="ml-3 text-[#fedac2]">Đang tải câu hỏi...</span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-[#fc5d01] mb-4">Danh Sách Câu Hỏi</h2>
        <div className="text-center py-8 text-[#fedac2]">
          Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#fc5d01] mb-6">
        Danh Sách Câu Hỏi ({questions.length})
      </h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-[#232323] p-4 rounded-lg border border-[#fd7f33] hover:border-[#fc5d01] transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#fc5d01] font-medium">
                    #{index + 1}
                  </span>
                  <span className="bg-[#fd7f33] text-white px-2 py-1 rounded text-xs font-medium">
                    {getQuestionTypeLabel(question.type)}
                  </span>
                  {question.difficulty && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  )}
                  {question.taskNumber && (
                    <span className="text-[#fedac2] text-xs">
                      {question.taskNumber}
                    </span>
                  )}
                </div>
                
                <div className="text-[#fedac2] text-sm mb-3">
                  <div className="line-clamp-3">
                    {question.content}
                  </div>
                </div>

                {/* Show options for RWFIB and RFIB */}
                {(question.type === 'rwfib' || question.type === 'rfib') && question.options && (
                  <div className="mt-3">
                    <div className="text-[#ffac7b] text-xs font-medium mb-1">Lựa chọn:</div>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(question.options) ? (
                        question.options.slice(0, 5).map((option, optIndex) => (
                          <span
                            key={optIndex}
                            className="bg-[#fd7f33] text-white px-2 py-1 rounded text-xs"
                          >
                            {option}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#fedac2] text-xs">Có lựa chọn</span>
                      )}
                      {Array.isArray(question.options) && question.options.length > 5 && (
                        <span className="text-[#fedac2] text-xs">
                          +{question.options.length - 5} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Show correct answers */}
                {question.correctAnswers && question.correctAnswers.length > 0 && (
                  <div className="mt-2">
                    <div className="text-green-400 text-xs font-medium mb-1">Đáp án:</div>
                    <div className="flex flex-wrap gap-1">
                      {question.correctAnswers.slice(0, 3).map((answer, ansIndex) => (
                        <span
                          key={ansIndex}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          {answer}
                        </span>
                      ))}
                      {question.correctAnswers.length > 3 && (
                        <span className="text-green-400 text-xs">
                          +{question.correctAnswers.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[#ffac7b] text-xs">
              ID: {question.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsList;
