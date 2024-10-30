// src/controllers/dataSensorController.js
const connection = require('../db');
/**
 * @swagger
 * components:
 *   schemas:
 *     DataSensor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của bản ghi
 *         nhiet_do:
 *           type: number
 *           description: Nhiệt độ
 *         do_am:
 *           type: number
 *           description: Độ ẩm
 *         anh_sang:
 *           type: number
 *           description: Cường độ ánh sáng
 *         thoi_gian:
 *           type: string
 *           format: date-time
 *           description: Thời gian ghi nhận
 */

/**
 * @swagger
 * /api/data-sensor:
 *   get:
 *     summary: Lấy tất cả dữ liệu cảm biến
 *     tags: [DataSensor]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: "Từ khóa tìm kiếm (vd: 25)"
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: "Điều kiện lọc dữ liệu (vd: nhiet_do, do_am, anh_sang, do_bui, thoi_gian)"
 *         enum: [nhiet_do, do_am, anh_sang, do_bui, thoi_gian]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataSensor'
 */
// src/controllers/dataSensorController.js
exports.getAllData = (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    console.log("searchTerm: ", searchTerm);
    console.log("req.query: ", req.query.filter);
    let query = 'SELECT * FROM DataSensor';
    
    // Sử dụng searchField để xác định trường tìm kiếm
    if (searchTerm) {
        switch (req.query.filter) {
            case 'nhiet_do': // Tìm kiếm theo nhiệt độ
                query += ` WHERE nhiet_do LIKE '%${searchTerm}%'`;
                break;
            case 'do_am': // Tìm kiếm theo độ ẩm
                query += ` WHERE do_am LIKE '%${searchTerm}%'`;
                break;
            case 'anh_sang': // Tìm kiếm theo ánh sáng
                query += ` WHERE anh_sang LIKE '%${searchTerm}%'`; 
                break;
            case 'do_bui': // Tìm kiếm theo độ bụi
                query += ` WHERE do_bui LIKE '%${searchTerm}%'`;
                break;
            case 'thoi_gian': // Tìm kiếm theo thời gian
                query += ` WHERE DATE_FORMAT(thoi_gian, '%d/%m/%Y, %H:%i:%s') LIKE '%${searchTerm}%'`;
                break;
            default:
                query += ` WHERE nhiet_do LIKE '%${searchTerm}%' OR do_am LIKE '%${searchTerm}%' OR anh_sang LIKE '%${searchTerm}%' OR do_bui LIKE '%${searchTerm}%' OR DATE_FORMAT(thoi_gian, '%d/%m/%Y, %H:%i:%s') LIKE '%${searchTerm}%'`;
                break;
        }
        console.log(query);
    }


    // Thực hiện truy vấn với prepared statements
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }

        // Điều chỉnh múi giờ trước khi trả về kết quả
        const adjustedResults = results.map(row => {
            const thoi_gian_local = new Date(row.thoi_gian).toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
            return { ...row, thoi_gian: thoi_gian_local };
        });
        console.log(query);
        res.json(adjustedResults);
    });

    

};


/**
 * @swagger
 * /api/data-sensor/last-data:
 *   get:
 *     summary: Lấy dữ liệu cảm biến gần đây nhất
 *     tags: [DataSensor]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataSensor'
 *       404:
 *         description: Không có dữ liệu
 */
exports.getLastData = (req, res) => {
    // Lấy dòng cuối cùng từ bảng DataSensor
    connection.query('SELECT * FROM DataSensor ORDER BY id DESC LIMIT 1', (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Không có dữ liệu trong bảng' });
            return;
        }
        res.json(results[0]); // Trả về dòng cuối cùng
    });
};

/**
 * @swagger
 * /api/data-sensor/data-chart:
 *   get:
 *     summary: Lấy các dữ liệu cảm biến gần đây (giới hạn 8 bản ghi)
 *     tags: [DataSensor]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Số bản ghi cần lấy (mặc định là 8)
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataSensor'
 */
exports.getData = (req, res) => {
    // Nhận tham số limit từ query, nếu không có thì mặc định là 8
    const { limit = 8 } = req.query;

    // Chuyển giá trị limit thành số nguyên
    const limitValue = parseInt(limit, 10);

    // Tạo câu truy vấn SQL để lấy 8 giá trị cuối cùng (ORDER BY id DESC)
    let query = `SELECT * FROM DataSensor ORDER BY id DESC LIMIT ?`;

    // Thực hiện truy vấn
    connection.query(query, [limitValue], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            return;
        }

        // Đảo ngược thứ tự kết quả để từ cũ đến mới (ngược với DESC)
        const adjustedResults = results.reverse().map(row => {
            // Chuyển đổi thời gian sang múi giờ địa phương
            const thoi_gian_local = new Date(row.thoi_gian).toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
            return { ...row, thoi_gian: thoi_gian_local };
        });

        // Trả về kết quả cho client
        res.json(adjustedResults);
    });
};
  


