const shopOwner = (req, res, next) => {
  // Check if user exists (from auth middleware)
  if (!req.user) {
    return res.status(401).send("Unauthorized. Please login.");
  }

  // Check if user is a shop owner
  if (req.user.role !== "shopOwner") {
    return res.status(403).send("Access denied. Shop owners only.");
  }

  next();
};

export default shopOwner;
