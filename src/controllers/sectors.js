const express = require('express');
const router = express.Router();
const mysql = require('../config/mysql');
const { verifySize, dataNormalized } = require('../helpers/helpers');

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
      sector: sector.map(({ sector }) => {
        return { value: sector, key: dataNormalized(sector) };
      }),
    };

    return res.jsonOK(response);
  } catch (error) {
    console.log(error);
    return res.jsonBadRequest(null);
  }
});

module.exports = router;
