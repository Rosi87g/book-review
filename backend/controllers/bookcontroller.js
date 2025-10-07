import bookmodel from "../models/bookmodel.js";

const booksList = async (req, res) => {
  try {
    // ✅ Only fetch books that are published
    const bookslist = await bookmodel
      .find({ publish: true }) // 🔥 This is the key fix
      .populate('addedBy', 'name email') // ✅ Publisher info
      .populate({
        path: 'reviews',
        select: 'rating reviewText userId',
        populate: { path: 'userId', select: 'name' } // ✅ Reviewer info
      });

    res.json({ success: true, bookslist });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { booksList };