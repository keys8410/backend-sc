const express = require('express');
const router = express.Router();
const mysql = require('../config/mysql');
const { verifySize } = require('../helpers/helpers');

router.get('/', async (req, res) => {
  const query = ` SELECT 
                    sector
                  FROM
                    tb_sector
                  ORDER BY
                    sector
                  ASC`;

  try {
    const sector = await mysql.execute(query);
    if (verifySize(sector)) return res.jsonConflict(null);

    const response = {
      sector: { name: sector.map(({ sector }) => sector) },
      sectorKey: sector.map(({ sector }) =>
        sector
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Zs]/g, '')
          .toLowerCase(),
      ),
    };

    return res.jsonOK(response);
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
  }
});

module.exports = router;
