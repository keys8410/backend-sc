const express = require('express');
const router = express.Router();
const mysql = require('../config/mysql');
const { verifySize } = require('../helpers/helpers');

router.get('/', async (req, res) => {
  const query = ` SELECT 
                    gender
                  FROM
                    tb_gender
                  ORDER BY
                    gender
                  ASC`;

  try {
    const gender = await mysql.execute(query);
    if (verifySize(gender)) return res.jsonConflict(null);

    const response = {
      gender: { name: gender.map(({ gender }) => gender) },
      genderKey: gender.map(({ gender }) =>
        gender
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
