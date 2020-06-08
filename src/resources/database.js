let database = JSON.parse(localStorage.getItem("data_warehouse")) || [
  {
    'id_gudang'      : '001',
    'kapasitas_maks' : 500,
    'terisi'         : 200,
    'tersisa'        : 300,
    'isi_gudang' : [
      {
        'sku'  : 'SKU001',
        'stok' : 100
      },
      {
        'sku'  : 'SKU002',
        'stok' : 100
      }
    ]
  },
  {
    'id_gudang'      : '002',
    'kapasitas_maks' : 500,
    'terisi'         : 100,
    'tersisa'        : 400,
    'isi_gudang' : [
      {
        'sku'  : 'SKU001',
        'stok' : 30
      },
      {
        'sku'  : 'SKU003',
        'stok' : 70
      }
    ]
  },
  {
    'id_gudang'      : '003',
    'kapasitas_maks' : 500,
    'terisi'         : 100,
    'tersisa'        : 400,
    'isi_gudang' : [
      {
        'sku'  : 'SKU001',
        'stok' : 30
      },
      {
        'sku'  : 'SKU003',
        'stok' : 70
      }
    ]
  },
  {
    'id_gudang'      : '004',
    'kapasitas_maks' : 500,
    'terisi'         : 100,
    'tersisa'        : 400,
    'isi_gudang' : [
      {
        'sku'  : 'SKU001',
        'stok' : 30
      },
      {
        'sku'  : 'SKU003',
        'stok' : 70
      }
    ]
  },
  {
    'id_gudang'      : '005',
    'kapasitas_maks' : 500,
    'terisi'         : 100,
    'tersisa'        : 400,
    'isi_gudang' : [
      {
        'sku'  : 'SKU001',
        'stok' : 30
      },
      {
        'sku'  : 'SKU003',
        'stok' : 70
      }
    ]
  },
  {
    'id_gudang'      : '006',
    'kapasitas_maks' : 500,
    'terisi'         : 100,
    'tersisa'        : 400,
    'isi_gudang' : [
      {
        'sku'  : 'SKU001',
        'stok' : 30
      },
      {
        'sku'  : 'SKU003',
        'stok' : 70
      }
    ]
  },
  {
    'id_gudang'      : '007',
    'kapasitas_maks' : 500,
    'terisi'         : 100,
    'tersisa'        : 400,
    'isi_gudang' : [
      {
        'sku'  : 'SKU001',
        'stok' : 30
      },
      {
        'sku'  : 'SKU003',
        'stok' : 70
      }
    ]
  }
]
export default database