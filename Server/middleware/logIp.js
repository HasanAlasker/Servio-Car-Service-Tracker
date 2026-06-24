const logIP = (label) => (req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  console.log(`[IP LOG] ${new Date().toISOString()} | ${label} | IP: ${ip} | User: ${req.user?._id || 'unauthenticated'}`);
  next();
};

export default logIP;