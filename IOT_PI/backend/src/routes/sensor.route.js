//API cho data sensor
import { Router } from 'express';
import { getSensors, homeGetSensors } from '../models/sensor.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const sensors = await getSensors({});
    res.json(sensors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/homes', async (req, res) => {
  try {
    const sensors = await homeGetSensors();
    res.json(sensors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @api {post} /adjust Tìm kiếm và phân trang dữ liệu cảm biến
 * @apiName AdjustSensors
 * @apiGroup Sensor
 * @apiVersion 1.0.0
 *
 * @apiDescription Lọc, tìm kiếm, sắp xếp và phân trang dữ liệu cảm biến.
 *
 * @apiParam {String} [term] Từ khóa để tìm kiếm.
 * @apiParam {String} [fieldToSearch] Tên trường muốn tìm kiếm (vd: "temperature").
 * @apiParam {String} [fieldToSort] Tên trường muốn sắp xếp (vd: "timestamp").
 * @apiParam {String} [sort="asc"] Thứ tự sắp xếp. `asc` cho tăng dần, `desc` cho giảm dần.
 * @apiParam {Number} [pageSize=10] Số lượng kết quả trên mỗi trang.
 * @apiParam {Number} [pageOrder=1] Số trang hiện tại.
 *
 * @apiParamExample {json} Ví dụ request body:
 * {
 * "fieldToSort": "timestamp",
 * "sort": "desc",
 * "pageSize": 5,
 * "pageOrder": 1
 * }
 *
 * @apiSuccess {Object[]} sensorsData Danh sách dữ liệu cảm biến đã được lọc.
 *
 * @apiSuccessExample {json} Phản hồi thành công:
 * HTTP/1.1 200 OK
 * [
 * {
 * "temperature": 26,
 * "humidity": 58,
 * "light": 500,
 * "timestamp": "2025-10-14 08:35:00"
 * }
 * ]
 *
 * @apiError (500 Internal Server Error) ServerError Lỗi từ máy chủ khi truy vấn dữ liệu.
 */
router.post('/adjust', async (req, res) => {
  try {
    const { term, fieldToSearch, fieldToSort, sort, pageSize, pageOrder } = req.body;

    const sensorsData = await getSensors({
      term,
      fieldToSearch,
      fieldToSort,
      sort,
      pageSize,
      pageOrder
    });
    res.status(200).json(sensorsData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
