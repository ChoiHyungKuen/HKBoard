import React, { useEffect, useState } from 'react';
import { Table, Button, Affix } from 'antd';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import moment from 'moment';
import 'moment/locale/ko';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import AddBoardModal from './AddBoardModal';

const Board = () => {
  const router = useRouter();
  const cache = useQueryClient();
  const [visible, setVisible] = useState(false);
  const { data, isLoading, error } = useQuery('boards', async () => {
    const { data } = await axios('http://localhost:3500/board', { withCredentials: true });
    return data;
  });
  const mutation = useMutation((boardIdx) => {
    return axios.delete(`http://localhost:3500/board/${boardIdx}`);
  });
  if (error) {
    console.log(error);
    router.replace('/');
  }
  if (!data) {
    return <>Loading...</>;
  }
  const removeData = (boardIdx) => {
    mutation.mutate(boardIdx, {
      onSuccess: (formData) => {
        console.log(formData);
        return cache.invalidateQueries('boards');
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };
  // const getBoardData = async () => {
  //   const result = await axios.get('http://localhost:3500/board');

  //   if (result) {
  //     setBoardData(result.data);
  //   }
  // };

  // const dataSource = [
  //   {
  //     key: '1',
  //     title: '게시판 제목입니다!!!',
  //     contents: '게시판의 내용입!',
  //     create_date: '2021-02-03',
  //     view_cnt: 0,
  //     img_path: '경로',
  //   },
  //   {
  //     key: '2',
  //     title: '게시판 제목입니다!!!',
  //     contents: '게시판의 내용입!',
  //     create_date: '2021-02-03',
  //     view_cnt: 0,
  //     img_path: '경로',
  //   },
  // ];
  const columns = [
    {
      title: '',
      dataIndex: 'operation',
      width: 50,
      render: (_, record) => (
        <Button icon={<DeleteOutlined />} onClick={() => removeData(record.board_idx)} />
      ),
    },
    {
      title: '제목',
      dataIndex: 'title',
    },
    {
      title: '내용',
      dataIndex: 'contents',
    },
    {
      title: '생성일',
      dataIndex: 'create_date',
      render: (create_date, record) => <>{moment(create_date).fromNow()}</>,
    },
    // {
    //   title: '이미지 경로',
    //   dataIndex: 'img_path',
    //   key: 'img_path',
    // },
    // {
    //   title: '조회수',
    //   dataIndex: 'view_cnt',
    //   key: 'view_cnt',
    // },
    {
      title: '작성자',
      dataIndex: 'id',
      key: 'id',
    },
  ];
  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      <Table
        dataSource={[
          {
            board_idx: 3,
            user_idx: 2,
            title: '제목1',
            contents: '내용입니다.',
            create_date: '2022-05-01T15:17:31.000Z',
            view_cnt: 0,
            img_path: null,
            id: 'test',
            name: '테스터',
            email: 'dd@navr.com',
          },
          {
            board_idx: 3,
            user_idx: 2,
            title: '제목2',
            contents: '내용입니다.',
            create_date: '2022-05-01T15:17:31.000Z',
            view_cnt: 0,
            img_path: null,
            id: 'test',
            name: '테스터',
            email: 'dd@navr.com',
          },
          {
            board_idx: 3,
            user_idx: 2,
            title: '제목3',
            contents: '내용입니다.',
            create_date: '2022-05-01T15:17:31.000Z',
            view_cnt: 0,
            img_path: null,
            id: 'test',
            name: '테스터',
            email: 'dd@navr.com',
          },
          {
            board_idx: 3,
            user_idx: 2,
            title: '제목4',
            contents: '내용입니다.',
            create_date: '2022-05-01T15:17:31.000Z',
            view_cnt: 0,
            img_path: null,
            id: 'test',
            name: '테스터',
            email: 'dd@navr.com',
          },
          {
            board_idx: 3,
            user_idx: 2,
            title: '제목5',
            contents: '내용입니다.',
            create_date: '2022-05-01T15:17:31.000Z',
            view_cnt: 0,
            img_path: null,
            id: 'test',
            name: '테스터',
            email: 'dd@navr.com',
          },
          {
            board_idx: 3,
            user_idx: 2,
            title: '제목6',
            contents: '내용입니다.',
            create_date: '2022-05-01T15:17:31.000Z',
            view_cnt: 0,
            img_path: null,
            id: 'test',
            name: '테스터',
            email: 'dd@navr.com',
          },
          {
            board_idx: 3,
            user_idx: 2,
            title: '제목7',
            contents: '내용입니다.',
            create_date: '2022-05-01T15:17:31.000Z',
            view_cnt: 0,
            img_path: null,
            id: 'test',
            name: '테스터',
            email: 'dd@navr.com',
          },
        ]}
        columns={columns}
        rowKey="board_idx"
      />
      <Affix offsetBottom={15} style={{ position: 'absolute', right: 15 }}>
        {/* <Button type="primary" icon={<FileAddOutlined />} onClick={() => setVisible(true)} /> */}
        <Button type="primary">글쓰기</Button>
      </Affix>
      <AddBoardModal visible={visible} hideModal={hideModal} userIdx={router.query.userIdx} />
    </>
  );
};

export default Board;
