//API cho lịch sử bật tắt
import { Router } from 'express';
import { getActions, getLatestState } from '../models/action.model.js';
import { sendCommand } from '../services/action.service.js';;

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 100), 1000);
    const actions = await getActions(limit);
    res.json(actions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/toggle', async (req, res) => {
  try {
    const device = req.body.device;
    if (!["fan", "light", "aircon"].includes(device)) {
      return res.status(400).json({ error: 'KHÔNG HỢP LỆ' });
    }
    await sendCommand({device});
    return res.status(200).json({"message": "OK"})
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const response = await getLatestState();
    return res.status(200).json(response);
  } catch(e){
    return res.status(500).json({error: e.message});
  }
})

router.post('/adjust',  async (req, res) => {
  try{
    const {term = "", fieldToSearch = "", pageSize = 10, pageOrder = 1} = req.body;
    const actions = await getActions({term, fieldToSearch, pageSize, pageOrder});
    res.status(200).json(actions);
  } catch (e){ 
    return res.status(500).json({error: e.message});
  }
})
export default router;
