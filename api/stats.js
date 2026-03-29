export default function handler(req, res) {
  res.status(200).json({
    trips: 2382,
    drivers: 64,
    earnings: 21300,
    customers: 14212
  });
}