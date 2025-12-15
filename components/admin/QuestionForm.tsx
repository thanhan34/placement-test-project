import React, { useState } from 'react';
import { QuestionType, Question } from '../../types/placement-test';

interface QuestionFormProps {
  onSubmit: (questionData: Omit<Question, 'id'>) => void;
  loading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, loading }) => {
  const [questionType, setQuestionType] = useState<QuestionType>('readAloud');
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [taskNumber, setTaskNumber] = useState('');
  const [options, setOptions] = useState<string[]>(['']);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const questionData: Omit<Question, 'id'> = {
      type: questionType,
      content: content.trim(),
      difficulty,
      taskNumber: taskNumber.trim() || undefined,
    } as Omit<Question, 'id'>;

    // Add type-specific fields
    if (questionType === 'rwfib' || questionType === 'rfib') {
      // Filter out empty options
      const filteredOptions = options.filter(opt => opt.trim() !== '');
      const filteredCorrectAnswers = correctAnswers.filter(ans => ans.trim() !== '');
      
      if (filteredOptions.length > 0) {
        (questionData as { options?: string[] }).options = filteredOptions;
      }
      if (filteredCorrectAnswers.length > 0) {
        (questionData as { correctAnswers?: string[] }).correctAnswers = filteredCorrectAnswers;
      }
    }

    onSubmit(questionData);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addCorrectAnswer = () => {
    setCorrectAnswers([...correctAnswers, '']);
  };

  const removeCorrectAnswer = (index: number) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
  };

  const updateCorrectAnswer = (index: number, value: string) => {
    const newAnswers = [...correctAnswers];
    newAnswers[index] = value;
    setCorrectAnswers(newAnswers);
  };

  const resetForm = () => {
    setContent('');
    setTaskNumber('');
    setOptions(['']);
    setCorrectAnswers(['']);
    setDifficulty('Medium');
  };

  return (
    <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#fc5d01] mb-6">Thêm Câu Hỏi Mới</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Type */}
        <div>
          <label className="block text-[#fedac2] text-sm font-medium mb-2">
            Loại Câu Hỏi *
          </label>
          <select
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value as QuestionType);
              resetForm();
            }}
            className="w-full p-3 bg-[#232323] border border-[#fd7f33] rounded-lg text-white focus:outline-none focus:border-[#fc5d01]"
            required
          >
            <option value="readAloud">Read Aloud</option>
            <option value="rwfib">Reading & Writing: Fill in the Blanks</option>
            <option value="rfib">Reading: Fill in the Blanks</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-[#fedac2] text-sm font-medium mb-2">
            Nội Dung Câu Hỏi *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              questionType === 'readAloud' 
                ? 'Nhập đoạn văn để đọc...'
                : questionType === 'rwfib'
                ? 'Nhập đoạn văn với các chỗ trống (sử dụng _____ để đánh dấu chỗ trống)...'
                : 'Nhập đoạn văn với các chỗ trống...'
            }
            rows={6}
            className="w-full p-3 bg-[#232323] border border-[#fd7f33] rounded-lg text-white focus:outline-none focus:border-[#fc5d01] resize-vertical"
            required
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[#fedac2] text-sm font-medium mb-2">
            Độ Khó
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
            className="w-full p-3 bg-[#232323] border border-[#fd7f33] rounded-lg text-white focus:outline-none focus:border-[#fc5d01]"
          >
            <option value="Easy">Dễ</option>
            <option value="Medium">Trung Bình</option>
            <option value="Hard">Khó</option>
          </select>
        </div>

        {/* Task Number */}
        <div>
          <label className="block text-[#fedac2] text-sm font-medium mb-2">
            Số Thứ Tự Task (Tùy chọn)
          </label>
          <input
            type="text"
            value={taskNumber}
            onChange={(e) => setTaskNumber(e.target.value)}
            placeholder="Ví dụ: Task 1, Task 2..."
            className="w-full p-3 bg-[#232323] border border-[#fd7f33] rounded-lg text-white focus:outline-none focus:border-[#fc5d01]"
          />
        </div>

        {/* Options for RWFIB and RFIB */}
        {(questionType === 'rwfib' || questionType === 'rfib') && (
          <div>
            <label className="block text-[#fedac2] text-sm font-medium mb-2">
              Các Lựa Chọn
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Lựa chọn ${index + 1}`}
                  className="flex-1 p-3 bg-[#232323] border border-[#fd7f33] rounded-lg text-white focus:outline-none focus:border-[#fc5d01]"
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="px-4 py-2 bg-[#fd7f33] text-white rounded-lg hover:bg-[#fc5d01]"
            >
              Thêm Lựa Chọn
            </button>
          </div>
        )}

        {/* Correct Answers for RWFIB and RFIB */}
        {(questionType === 'rwfib' || questionType === 'rfib') && (
          <div>
            <label className="block text-[#fedac2] text-sm font-medium mb-2">
              Đáp Án Đúng
            </label>
            {correctAnswers.map((answer, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => updateCorrectAnswer(index, e.target.value)}
                  placeholder={`Đáp án ${index + 1}`}
                  className="flex-1 p-3 bg-[#232323] border border-[#fd7f33] rounded-lg text-white focus:outline-none focus:border-[#fc5d01]"
                />
                {correctAnswers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCorrectAnswer(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCorrectAnswer}
              className="px-4 py-2 bg-[#fd7f33] text-white rounded-lg hover:bg-[#fc5d01]"
            >
              Thêm Đáp Án
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={`flex-1 py-3 px-6 rounded-lg font-medium ${
              loading || !content.trim()
                ? 'bg-[#ffac7b] cursor-not-allowed'
                : 'bg-[#fc5d01] hover:bg-[#fd7f33]'
            } text-white transition-colors`}
          >
            {loading ? 'Đang Thêm...' : 'Thêm Câu Hỏi'}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 bg-[#232323] border border-[#fd7f33] text-[#fedac2] rounded-lg hover:bg-[#2b2b2b] transition-colors"
          >
            Làm Mới
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
