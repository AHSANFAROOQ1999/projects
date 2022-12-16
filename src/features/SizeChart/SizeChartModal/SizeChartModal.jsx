import React, { useState } from "react";
import SizeChart from "../SizeChart";
import { Button, Modal, Typography } from "antd";
import "../SizeChart.scss";

function SizeChartModal(props) {
  const { Text } = Typography;

  const [table, setTable] = useState(props?.sizeChart);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="sizechart-modal">
      <Text onClick={showModal}>View size chart</Text>
      {/* <Button onClick={showModal} className="view_size_chart">
        View size chart
      </Button> */}
      <Modal
        title="Size Chart"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        <SizeChart sizeChart={table} />
      </Modal>
    </div>
  );
}

export default SizeChartModal;
