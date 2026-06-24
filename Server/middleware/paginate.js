// middleware/paginate.js
export const paginate = (buildQuery) => {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      // buildQuery is a function the route provides with its filters
      const query = buildQuery(req);
      const total = await query.model.countDocuments(query.filter);

      const results = await query.model
        .find(query.filter)
        .sort(query.sort || {})
        .skip(skip)
        .limit(limit)
        .populate(query.populate || []);

      res.paginate = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: page * limit < total ? { page: page + 1, limit } : null,
        prev: page > 1 ? { page: page - 1, limit } : null,
        results,
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
};
