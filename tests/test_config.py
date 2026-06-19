import unittest
import os
from src.config import load_config, BASE_DIR

class TestConfig(unittest.TestCase):
    
    def test_config_loads_successfully(self):
        config_path = os.path.join(BASE_DIR, "config.yaml")
        self.assertTrue(os.path.exists(config_path), "config.yaml should exist in the root directory.")
        
        config = load_config(config_path)
        self.assertIn("spatial", config, "spatial configuration key missing.")
        self.assertEqual(config["spatial"]["target_crs"], "EPSG:32643")
        self.assertEqual(config["spatial"]["resolution_meters"], 30)

if __name__ == '__main__':
    unittest.main()
