import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Question } from '../types/placement-test';
import QuestionForm from '../components/admin/QuestionForm';
import QuestionsList from '../components/admin/QuestionsList';

const AdminPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  // Load questions on component mount
  useEffect(() => {
    if (activeTab === 'list') {
      loadQuestions();
    }
  }, [activeTab]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/questions/list');
      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions || []);
      } else {
        throw new Error(data.message || 'Failed to load questions');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Lỗi khi tải danh sách câu hỏi'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (questionData: any) => {
    try {
      setSubmitting(true);
      setMessage(null);

      const response = await fetch('/api/questions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Câu hỏi đã được thêm thành công!'
        });
        
        // Refresh questions list if we're on the list tab
        if (activeTab === 'list') {
          loadQuestions();
        }
      } else {
        throw new Error(data.message || 'Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Lỗi khi thêm câu hỏi'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#232323] py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Admin - Quản Lý Câu Hỏi | PTE Intensive</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo1.png" 
              alt="PTE Intensive Logo" 
              width={120} 
              height={120} 
              className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]" 
              priority 
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fc5d01] mb-2">
            Admin Panel
          </h1>
          <p className="text-[#fedac2] text-sm sm:text-base">
            Quản lý câu hỏi Placement Test
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#2b2b2b] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'add'
                  ? 'bg-[#fc5d01] text-white'
                  : 'text-[#fedac2] hover:text-white hover:bg-[#fd7f33]'
              }`}
            >
              Thêm Câu Hỏi
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-[#fc5d01] text-white'
                  : 'text-[#fedac2] hover:text-white hover:bg-[#fd7f33]'
              }`}
            >
              Danh Sách Câu Hỏi
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            message.type === 'success' 
              ? 'bg-green-900 border border-green-600 text-green-200' 
              : 'bg-red-900 border border-red-600 text-red-200'
          }`}>
            <span>{message.text}</span>
            <button
              onClick={clearMessage}
              className="ml-4 text-xl font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeTab === 'add' ? (
            <>
              {/* Question Form */}
              <div className="lg:col-span-1">
                <QuestionForm 
                  onSubmit={handleSubmitQuestion}
                  loading={submitting}
                />
              </div>

              {/* Instructions */}
              <div className="lg:col-span-1">
                <div className="bg-[#2b2b2b] p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold text-[#fc5d01] mb-4">
                    Hướng Dẫn Sử Dụng
                  </h2>
                  
                  <div className="space-y-4 text-[#fedac2] text-sm">
                    <div>
                      <h3 className="font-semibold text-[#ffac7b] mb-2">Read Aloud:</h3>
                      <p>Nhập đoạn văn mà học sinh sẽ đọc to. Không cần thêm lựa chọn hay đáp án.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#ffac7b] mb-2">Reading & Writing Fill in the Blanks:</h3>
                      <p>Nhập đoạn văn với chỗ trống (sử dụng _____). Thêm các lựa chọn và đáp án đúng.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#ffac7b] mb-2">Reading Fill in the Blanks:</h3>
                      <p>Tương tự RWFIB nhưng chỉ tập trung vào reading. Thêm lựa chọn và đáp án.</p>
                    </div>

                    <div className="border-t border-[#fd7f33] pt-4">
                      <h3 className="font-semibold text-[#ffac7b] mb-2">Lưu ý:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Nội dung câu hỏi là bắt buộc</li>
                        <li>Chọn độ khó phù hợp</li>
                        <li>Task number là tùy chọn</li>
                        <li>Với RWFIB/RFIB: thêm đủ lựa chọn và đáp án</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="lg:col-span-2">
              <QuestionsList 
                questions={questions}
                loading={loading}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-[#fedac2] text-sm">
          <p>© 2025 PTE Intensive. Admin Panel v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
