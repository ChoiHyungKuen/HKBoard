import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Input } from 'antd';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const AddBoardModal = (props) => {
  const cache = useQueryClient();
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const mutation = useMutation((boardData) => {
    return axios.post('http://localhost:3500/board', boardData);
  });

  const addBoard = async () => {
    console.log('작성');
    mutation.mutate(
      { title, contents, userIdx: props.userIdx },
      {
        onSuccess: (formData) => {
          console.log(formData);
          props.hideModal();
          return cache.invalidateQueries('boards');
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  // if (mutation.isSuccess) {
  //   cache.invalidateQueries('boards', {
  //     refetchActive: true,
  //     refetchInactive: false,
  //   });
  //   props.hideModal();
  // }

  return (
    <Modal
      title="게시판 작성"
      centered
      visible={props.visible}
      onOk={() => addBoard()}
      onCancel={() => props.hideModal()}
      okText="작성"
      cancelText="취소"
      width={500}
    >
      <Row gutter={[6, 12]}>
        <Col span={6}>제목</Col>
        <Col span={18}>
          <Input onChange={(e) => setTitle(e.target.value)} />
        </Col>
        <Col span={6}>내용</Col>
        <Col span={18}>
          <Input onChange={(e) => setContents(e.target.value)} />
        </Col>
      </Row>
    </Modal>
  );
};

export default AddBoardModal;
