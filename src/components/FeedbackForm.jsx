import React, { useState } from 'react';

function FeedbackPopup({ isOpen, onClose, questId }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        
        if (!comment.trim()) {
            alert('Please add a comment');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5002/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'USER_ID_HERE', // Replace with actual user ID from auth
                    rate: rating,
                    comment,
                    image: image || undefined,
                    questId: questId
                })
            });

            if (response.ok) {
                alert('Thank you for your feedback!');
                onClose();
                setRating(0);
                setComment('');
                setImage('');
                setImageFile(null);
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 font-mono bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FFF9F0] rounded-[10px] p-[20px] max-w-[500px] w-11/12 max-h-[600px] overflow-auto shadow-2xl border-[25px] border-[#FFE5BF]"
            >
                {/* Header */}
                <div className="mb-2 p-1">
                    <h2 className="text-3xl font-bold mb-2">
                        Congratulations! 🎉
                    </h2>
                    <p className="text-lg text-gray-800">
                        You have successfully completed your quest!
                    </p>
                </div>

                <div className="rounded-2xl p-1">
                    <p className="text-base mb-5">
                        Please take a moment to complete this short form to help us improve.
                    </p>

                    {/* Star Rating */}
                    <div className="mb-6">
                        <label className="block text-sm">
                            How did you feel about the quest?
                        </label>
                        <div className="flex gap-2 text-5xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`cursor-pointer transition-colors ${
                                        star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    style={{ WebkitTextStroke: '1px #333' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm">
                            What did you enjoy or didn't enjoy?
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full min-h-15 p-3 text-sm rounded-lg border-2 border-[#D4C4A8] resize-y bg-white focus:outline-none focus:ring-2 focus:ring-[#B8A989]"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-8">
                        <label className="block mb-2 text-sm">
                            Optional: Upload a photo you took about your quest
                        </label>
                        
                        {!image ? (
                            <label className="flex flex-col items-center justify-center h-44 border-2 border-[#D4C4A8] rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-blue-400 text-sm">+ Add Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div className="relative inline-block w-full">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="w-full max-h-52 object-cover rounded-xl border-2 border-[#D4C4A8]"
                                />
                                <button
                                    onClick={() => {
                                        setImage('');
                                        setImageFile(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-red-600 transition-colors"
                                >
                                    x
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-3 text-base bg-[#FFDBA6] text-gray-800 border-2 border-[#B8A989] rounded-full font-bold hover:bg-[#f9b25b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-10 py-3 text-base bg-[#C0DBE4] text-black border-2 border-[#78A2B0] rounded-full font-bold hover:bg-[#78A2B0] transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackPopup;