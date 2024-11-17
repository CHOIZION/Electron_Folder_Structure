// src/App.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import {
  FaBars,
  FaSyncAlt,
  FaSort,
  FaSearch,
  FaMinus,
  FaPlus,
  FaFilter,
  FaLink,
  FaChevronRight,
  FaChevronDown,
  FaStar,
  FaRegStar,
  FaTimes,
  FaAngleDoubleUp,
  FaAngleDoubleDown,
} from 'react-icons/fa';
import Papa from 'papaparse'; // CSV 파싱을 위한 라이브러리

// Assets 폴더에 위치한 이미지 파일들
import RenPyIcon from './Assets/RenPy.svg';
import MielImage from './Assets/Miel.png';
import XvideosPlaceholder from './Assets/Xvideos.png'; // Placeholder 이미지 추가
import DefaultImage from './Assets/default.png'; // 기본 이미지

// 스타일 컴포넌트 정의
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #121212;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #1e1e1e;
  flex-wrap: wrap;
`;

// 좌측 섹션 (메뉴 버튼)
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

// 중앙 섹션 ("등록된 작품" 정보와 검색 바)
const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;

  @media (min-width: 768px) {
    margin: 0;
  }
`;

// 우측 섹션 (축소/확대, 필터링, 연결 버튼)
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

// 메뉴 버튼 컨테이너
const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 10px;
`;

// 일반 메뉴 버튼 스타일
const MenuButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 8px;
  width: 60px;
  height: 50px;
  cursor: pointer;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background-color: #444;
  }
`;

// 드롭다운 메뉴 스타일
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2a2a2a;
  padding: 5px 0;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  z-index: 1;
  border-radius: 4px;
`;

// 드롭다운 메뉴 아이템 스타일
const MenuItem = styled.button`
  background-color: #333;
  color: white;
  border: none;
  width: 180px;
  padding: 10px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

// 메뉴 버튼의 아이콘 스타일
const MenuButtonIcon = styled.div`
  font-size: 20px;
`;

// 메뉴 버튼의 텍스트 스타일
const MenuButtonText = styled.span`
  font-size: 10px;
  margin-top: 4px;
`;

// 게임 정보 스타일
const GameInfo = styled.span`
  margin-right: 15px;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

// 검색 바 컨테이너
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #333;
  border: 1px solid #444;
  padding: 5px 10px;
  border-radius: 4px;
  width: 840px;
  margin-left: 10px;
`;

// 검색 입력 필드 스타일
const SearchInput = styled.input`
  background-color: #333;
  color: white;
  border: none;
  outline: none;
  padding: 5px;
  flex-grow: 1;
`;

// 검색 아이콘 스타일
const SearchIcon = styled(FaSearch)`
  color: white;
  margin-right: 5px;
`;

// 액션 버튼 스타일 (축소/확대, 필터링, 연결)
const ActionButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 8px;
  width: 60px;
  height: 50px;
  cursor: pointer;
  margin-left: 5px;
  display: flex;
  flex-direction: column; /* 아이콘 위에 텍스트 배치 */
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background-color: #444;
  }
`;

// 액션 버튼의 아이콘 스타일
const ActionButtonIcon = styled.div`
  font-size: 20px;
`;

// 액션 버튼의 텍스트 스타일
const ActionButtonText = styled.span`
  font-size: 10px;
  margin-top: 4px;
`;

// 필터 드롭다운 스타일
const DropdownFilter = styled(DropdownMenu)`
  left: auto;
  right: 0;
`;

// 필터 버튼 스타일
const FilterButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  width: 180px;
  padding: 10px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

// 버튼 컨테이너 및 버튼 스타일
const TopButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const TopButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #444;
  }
`;

// 빠른 이동 드롭다운 컨테이너
const QuickNavContainer = styled.div`
  position: relative;
`;

// 빠른 이동 드롭다운 메뉴
const QuickNavDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2a2a2a;
  padding: 5px 0;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  z-index: 1;
  border-radius: 4px;
  width: 180px;
`;

// 빠른 이동 버튼
const QuickNavButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  width: 100%;
  padding: 10px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

// 컨텐츠 영역 스타일
const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 메인 컨텐츠 스타일
const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

// 트리 구조 관련 스타일
const TreeContainer = styled.div`
  margin-left: ${({ level }) => level * 20}px;
`;

const TreeNode = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const NodeIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const NodeTitle = styled.span`
  font-weight: bold;
`;

const SubNodeList = styled.div`
  margin-top: 5px;
`;

// 게임 아이템 스타일
const GameItemContainer = styled.div`
  width: 200px;
  border-radius: 10px;
  background-color: #1e1e1e;
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const GameThumbnail = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
`;

const GameInfoContainer = styled.div`
  margin-top: 10px;
  flex-grow: 1;
`;

const GameTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const GameVersion = styled.p`
  margin: 5px 0;
  font-size: 14px;
`;

const AuthorName = styled.p`
  margin: 5px 0;
  font-size: 14px;
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
`;

// 폴더로 가기 버튼 스타일
const GoToFolderButton = styled.button`
  background-color: #555;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-top: 5px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;

  &:hover {
    background-color: #666;
  }
`;

// 수정일 표시 스타일
const ModificationDate = styled.p`
  margin: 5px 0;
  font-size: 12px;
  color: #aaa;
`;

// Category 관련 스타일
const CategorySection = styled.div`
  margin-bottom: 30px;
`;

const CategoryTitle = styled.h2`
  margin-bottom: 10px;
  font-size: 20px;
  border-bottom: 2px solid #444;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const CategoryTitleText = styled.span`
  margin-left: 8px;
`;

// Modal 스타일 설정
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '80vh',
    overflow: 'auto',
    backgroundColor: '#1e1e1e',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '20px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

Modal.setAppElement('#root'); // Accessibility 설정

const App = () => {
  const [searchInput, setSearchInput] = useState('');
  const [registeredWorks, setRegisteredWorks] = useState(0);
  const [connectedDirectory, setConnectedDirectory] = useState('');
  const [categoryFolders, setCategoryFolders] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0); // 로딩 프로그레스

  // 독립적인 확장 상태 관리
  const [expandedNodesMain, setExpandedNodesMain] = useState({});
  const [expandedNodesModal, setExpandedNodesModal] = useState({});

  // 새로운 상태 변수 추가
  const [displayLevel, setDisplayLevel] = useState(0); // -2: 최대 확대, -1: 중간 확대, 0: 기본, 1: 축소1, 2: 축소2
  const [activeFilter, setActiveFilter] = useState('전체'); // 필터링 상태

  const [isMainMenuVisible, setIsMainMenuVisible] = useState(false);
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isQuickNavVisible, setIsQuickNavVisible] = useState(false); // QuickNav 상태
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [sortOption, setSortOption] = useState('');

  const categoryNames = [
    '전체', // "전체" 버튼 추가
    'DesiredCategory1',
    'DesiredCategory2',
    'DesiredCategory3',
    'DesiredCategory4',
    'DesiredCategory5',
    'DesiredCategory6',
    'DesiredCategory7',
    'DesiredCategory8',
  ];

  // 별점 저장을 위한 상태
  const [ratings, setRatings] = useState({});

  const menuRef = useRef();
  const sortMenuRef = useRef();
  const filterRef = useRef();
  const quickNavRef = useRef();

  // Refs for categories and items
  const categoryRefs = useRef({});
  const itemRefs = useRef({});

  // 앱 시작 시 저장된 디렉토리와 확장 상태를 로드합니다.
  useEffect(() => {
    const savedDirectory = localStorage.getItem('connectedDirectory') || '';
    setConnectedDirectory(savedDirectory);

    const savedFolders = JSON.parse(localStorage.getItem('categoryFolders')) || {};
    setCategoryFolders(savedFolders);

    const savedExpandedMain = JSON.parse(localStorage.getItem('expandedNodesMain')) || {};
    setExpandedNodesMain(savedExpandedMain);

    const savedExpandedModal = JSON.parse(localStorage.getItem('expandedNodesModal')) || {};
    setExpandedNodesModal(savedExpandedModal);

    // 등록된 작품 수 계산
    let totalWorks = 0;
    Object.values(savedFolders).forEach((subfolders) => {
      if (Array.isArray(subfolders)) {
        totalWorks += subfolders.length;
      } else {
        // 'DesiredCategory6'과 'DesiredCategory7' 카테고리의 경우
        Object.values(subfolders).forEach((items) => {
          totalWorks += items.length;
        });
      }
    });
    setRegisteredWorks(totalWorks);

    // 로컬 스토리지에서 별점 로드
    const savedRatings = JSON.parse(localStorage.getItem('ratings')) || {};
    setRatings(savedRatings);
  }, []);

  // 확장 상태를 로컬 스토리지에 저장합니다.
  useEffect(() => {
    localStorage.setItem('expandedNodesMain', JSON.stringify(expandedNodesMain));
  }, [expandedNodesMain]);

  useEffect(() => {
    localStorage.setItem('expandedNodesModal', JSON.stringify(expandedNodesModal));
  }, [expandedNodesModal]);

  // 별점 상태를 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  // 클릭 외부 영역 감지하여 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMainMenuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMainMenuVisible(false);
      }
      if (isSortMenuVisible && sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setIsSortMenuVisible(false);
      }
      if (isFilterVisible && filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterVisible(false);
      }
      if (isQuickNavVisible && quickNavRef.current && !quickNavRef.current.contains(event.target)) {
        setIsQuickNavVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMainMenuVisible, isSortMenuVisible, isFilterVisible, isQuickNavVisible]);

  // 축소 버튼 클릭 시 displayLevel 증가 (최대 2)
  const handleZoomOut = () => {
    setDisplayLevel((prev) => Math.min(prev + 1, 2));
  };

  // 확대 버튼 클릭 시 displayLevel 감소 (최소 -2)
  const handleZoomIn = () => {
    setDisplayLevel((prev) => Math.max(prev - 1, -2));
  };

  const handleFilterButtonClick = (filterName) => {
    setActiveFilter(filterName);
    setIsFilterVisible(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // '연결' 버튼 클릭 시 디렉토리 선택 창을 엽니다.
  const handleConnect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true; // 디렉토리 선택 허용 (Chrome 기반 브라우저)
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        await processFiles(files);
        alert(`디렉토리가 연결되었습니다: ${files[0].webkitRelativePath.split('/')[0]}`);
      } else {
        alert('디렉토리를 선택하지 않았습니다.');
      }
    };
    input.click();
  };

  // 비디오 파일에서 썸네일 추출 함수
  const extractVideoThumbnail = (file, fullPath) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const url = URL.createObjectURL(file);
      video.src = url;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.currentTime = 1; // 첫 번째 프레임을 추출할 시간 (초)

      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve({ fullPath, thumbnail: dataURL });
      });

      video.addEventListener('error', () => {
        // 비디오 로딩 에러 시 기본 이미지 사용
        console.error(`비디오 로딩 에러: ${file.name}`);
        URL.revokeObjectURL(url);
        resolve({ fullPath, thumbnail: XvideosPlaceholder });
      });
    });
  };

  // CSV 파일 경로
  const getCSVPath = () => {
    const basePath = 'YOUR_DIRECTORY_PATH'; // 베이스 경로 수정 필요
    return `${basePath}/directory_cache.csv`;
  };

  // CSV 파일을 읽어오는 함수
  const readCSV = () => {
    return new Promise((resolve, reject) => {
      const fs = window.require('fs');
      const csvPath = getCSVPath();
      if (fs.existsSync(csvPath)) {
        const csvFile = fs.readFileSync(csvPath, 'utf8');
        Papa.parse(csvFile, {
          header: true,
          complete: (results) => {
            resolve(results.data);
          },
          error: (error) => {
            reject(error);
          },
        });
      } else {
        resolve([]);
      }
    });
  };

  // CSV 파일을 쓰는 함수
  const writeCSV = (data) => {
    const fs = window.require('fs');
    const csvPath = getCSVPath();
    const csv = Papa.unparse(data);
    fs.writeFileSync(csvPath, csv, 'utf8');
  };

  // 디렉토리 구조를 CSV와 비교하여 업데이트하는 함수
  const updateWithCSV = async (currentData) => {
    const existingData = await readCSV();
    const existingMap = new Map();
    existingData.forEach((item) => {
      existingMap.set(item.fullPath, item);
    });

    const updatedData = [];

    // 업데이트 및 추가
    currentData.forEach((item) => {
      if (existingMap.has(item.fullPath)) {
        // 수정된 부분 확인 (예: 수정일)
        if (existingMap.get(item.fullPath).modificationDate !== item.modificationDate) {
          updatedData.push(item);
        }
        existingMap.delete(item.fullPath); // 나중에 삭제를 확인하기 위해 제거
      } else {
        // 추가된 항목
        updatedData.push(item);
      }
    });

    // 삭제된 항목은 제외

    // 최종 데이터
    const finalData = [...currentData, ...updatedData];
    writeCSV(finalData);

    return { finalData };
  };

  // 디렉토리 스캔 및 데이터 처리 함수
  const processFiles = async (files) => {
    if (files.length === 0) return;

    const rootDirectory = files[0].webkitRelativePath.split('/')[0];
    setConnectedDirectory(rootDirectory);
    localStorage.setItem('connectedDirectory', rootDirectory);

    // 카테고리 폴더의 바로 아래 폴더들만 추출
    const categoryMap = {};
    const thumbnailPromises = [];
    const totalFiles = files.length;
    let processedFiles = 0;

    // 로딩 프로그레스 초기화
    setLoadingProgress(0);

    // 진행 상태 업데이트 함수
    const incrementProgress = () => {
      processedFiles += 1;
      setLoadingProgress(Math.round((processedFiles / totalFiles) * 100));
    };

    // `for...of` 루프를 사용하여 비동기적으로 파일을 처리합니다.
    for (const file of files) {
      const pathParts = file.webkitRelativePath.split('/');
      // 루트 디렉토리 / 카테고리 폴더 / 서브 폴더 / ...
      if (pathParts.length >= 3) {
        const category = pathParts[1];
        const extension = file.name.split('.').pop().toLowerCase();

        // 압축 파일 제외
        const compressedExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
        if (compressedExtensions.includes(extension)) {
          // 압축 파일이면 무시
          incrementProgress();
          await new Promise((resolve) => setTimeout(resolve, 0));
          continue;
        }

        if (categoryNames.includes(category)) {
          if (!categoryMap[category]) {
            categoryMap[category] = ['DesiredCategory6', 'DesiredCategory7'].includes(category) ? {} : [];
          }

          if (['DesiredCategory6'].includes(category)) { // '동인' -> 'DesiredCategory6'
            // DesiredCategory6 폴더는 구조가 다름: 카테고리 / 작가 / 작품
            if (pathParts.length >= 4) {
              const artist = pathParts[2];
              const work = pathParts[3].split('.')[0]; // 확장자 제거
              const fullPath = `${rootDirectory}/${category}/${artist}/${work}`;

              if (!categoryMap[category][artist]) {
                categoryMap[category][artist] = [];
              }

              // 작품이 이미 추가되었는지 확인
              if (!categoryMap[category][artist].some((item) => item.name === work)) {
                const newWork = { name: work, thumbnail: null, fullPath, modificationDate: file.lastModified };
                categoryMap[category][artist].push(newWork);
              }

              // 해당 작품의 첫 번째 이미지 찾기
              const workItem = categoryMap[category][artist].find((item) => item.name === work);
              if (file.type.startsWith('image/') && !workItem.thumbnail) {
                const url = URL.createObjectURL(file);
                workItem.thumbnail = url;
              }
            }
          } else if (['DesiredCategory7'].includes(category)) { // '포르노' -> 'DesiredCategory7'
            // DesiredCategory7 폴더: 카테고리 / SubCategory / 작품
            if (pathParts.length >= 4) {
              const subCategory = pathParts[2];
              const video = pathParts[3].split('.')[0]; // 확장자 제거
              const fullPath = `${rootDirectory}/${category}/${subCategory}/${video}`;

              if (!categoryMap[category][subCategory]) {
                categoryMap[category][subCategory] = [];
              }

              // 영상이 이미 추가되었는지 확인
              if (!categoryMap[category][subCategory].some((item) => item.name === video)) {
                const newVideo = { name: video, thumbnail: XvideosPlaceholder, fullPath, modificationDate: file.lastModified };
                categoryMap[category][subCategory].push(newVideo);
              }

              // 해당 영상의 썸네일 추출을 위한 프로미스 추가
              const videoItem = categoryMap[category][subCategory].find((item) => item.name === video);
              if (file.type.startsWith('video/')) {
                thumbnailPromises.push(extractVideoThumbnail(file, fullPath));
              } else if (file.type.startsWith('image/') && !videoItem.thumbnail) {
                // 영상과 동일한 이름의 이미지 파일을 썸네일로 사용 (예: video1.mp4 -> video1.jpg)
                const expectedThumbnailName = `${video}.jpg`;
                if (file.name.toLowerCase() === expectedThumbnailName.toLowerCase()) {
                  const url = URL.createObjectURL(file);
                  videoItem.thumbnail = url;
                } else if (!videoItem.thumbnail) {
                  // 만약 동일한 이름의 이미지가 없다면 첫 번째 이미지 파일을 썸네일로 할당
                  const url = URL.createObjectURL(file);
                  videoItem.thumbnail = url;
                }
              }
            }
          } else {
            // 기타 카테고리
            const subfolder = pathParts[2].split('.')[0]; // 확장자 제거
            const fullPath = `${rootDirectory}/${category}/${subfolder}`;

            if (!categoryMap[category].some((item) => item.name === subfolder)) {
              categoryMap[category].push({ name: subfolder, thumbnail: null, fullPath, modificationDate: file.lastModified });
            }

            // 해당 서브폴더의 첫 번째 이미지 찾기
            const subfolderItem = categoryMap[category].find((item) => item.name === subfolder);
            if (file.type.startsWith('image/') && !subfolderItem.thumbnail) {
              const url = URL.createObjectURL(file);
              subfolderItem.thumbnail = url;
            }
          }
        }
      }

      // 진행 상태 업데이트
      incrementProgress();

      // 작은 딜레이를 추가하여 UI가 업데이트될 시간을 줍니다.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    // 썸네일 추출 프로미스 처리
    const thumbnails = await Promise.all(thumbnailPromises);
    thumbnails.forEach(({ fullPath, thumbnail }) => {
      // 썸네일을 해당 아이템에 할당
      const [category, subCategory, workName] = fullPath.split('/').slice(1); // 루트 제외
      if (categoryMap[category] && categoryMap[category][subCategory]) {
        const workItem = categoryMap[category][subCategory].find((item) => item.fullPath === fullPath);
        if (workItem) {
          workItem.thumbnail = thumbnail;
        }
      }
    });

    // 기존 categoryFolders과 새로운 categoryMap을 병합 후 CSV 업데이트
    const allCurrentData = [];
    Object.keys(categoryMap).forEach((category) => {
      if (['DesiredCategory6', 'DesiredCategory7'].includes(category)) {
        Object.keys(categoryMap[category]).forEach((sub) => {
          categoryMap[category][sub].forEach((item) => {
            allCurrentData.push({
              category,
              subCategory: sub,
              artist: category === 'DesiredCategory6' ? sub : '',
              workName: item.name,
              fullPath: item.fullPath,
              thumbnail: item.thumbnail || DefaultImage,
              modificationDate: item.modificationDate,
            });
          });
        });
      } else {
        categoryMap[category].forEach((item) => {
          allCurrentData.push({
            category,
            subCategory: '',
            artist: '',
            workName: item.name,
            fullPath: item.fullPath,
            thumbnail: item.thumbnail || DefaultImage,
            modificationDate: item.modificationDate,
          });
        });
      }
    });

    // CSV과 비교하여 업데이트
    const { finalData } = await updateWithCSV(allCurrentData);

    // 카테고리 맵 업데이트
    const updatedCategoryMap = {};
    finalData.forEach((item) => {
      const { category, subCategory, artist, workName, fullPath, thumbnail, modificationDate } = item;
      if (!updatedCategoryMap[category]) {
        updatedCategoryMap[category] = ['DesiredCategory6', 'DesiredCategory7'].includes(category) ? {} : [];
      }

      if (category === 'DesiredCategory6') {
        if (!updatedCategoryMap[category][artist]) {
          updatedCategoryMap[category][artist] = [];
        }
        updatedCategoryMap[category][artist].push({
          name: workName,
          thumbnail,
          fullPath,
          modificationDate,
        });
      } else if (category === 'DesiredCategory7') {
        if (!updatedCategoryMap[category][subCategory]) {
          updatedCategoryMap[category][subCategory] = [];
        }
        updatedCategoryMap[category][subCategory].push({
          name: workName,
          thumbnail,
          fullPath,
          modificationDate,
        });
      } else {
        updatedCategoryMap[category].push({
          name: workName,
          thumbnail,
          fullPath,
          modificationDate,
        });
      }
    });

    setCategoryFolders(updatedCategoryMap);

    // 등록된 작품 수 계산
    let totalWorks = 0;
    finalData.forEach((item) => {
      totalWorks += 1;
    });
    setRegisteredWorks(totalWorks);

    // 로딩 완료
    setLoadingProgress(100);

    // CSV 업데이트 완료 후 잠시 후 로딩 바를 사라지게 합니다.
    setTimeout(() => setLoadingProgress(0), 500);
  };

  // '초기화' 버튼 클릭 시
  const handleReset = () => {
    localStorage.removeItem('connectedDirectory');
    localStorage.removeItem('categoryFolders');
    localStorage.removeItem('expandedNodesMain');
    localStorage.removeItem('expandedNodesModal');
    localStorage.removeItem('ratings');
    setConnectedDirectory('');
    setCategoryFolders({});
    setExpandedNodesMain({});
    setExpandedNodesModal({});
    setRegisteredWorks(0);
    setRatings({});
    setIsMainMenuVisible(false);
    setIsSortMenuVisible(false);
    window.location.reload();
  };

  const handleExit = () => {
    setIsMainMenuVisible(false);
    window.close();
  };

  const handleRestart = () => {
    setIsMainMenuVisible(false);
    window.location.reload();
  };

  // 별점 설정 함수
  const handleRatingClick = (category, itemKey, ratingValue) => {
    setRatings({
      ...ratings,
      [category]: {
        ...ratings[category],
        [itemKey]: ratingValue,
      },
    });
  };

  // 폴더 이름에서 게임 이름과 버전 추출
  const parseGameFolderName = (folderName) => {
    if (!folderName || typeof folderName !== 'string') {
      console.error('Invalid folderName:', folderName);
      return { gameName: '알 수 없음', version: '알 수 없음' };
    }

    // "(완)"이 포함된 경우
    if (folderName.includes('(완)')) {
      const gameName = folderName.replace('(완)', '').trim();
      return { gameName, version: '완결' };
    } else {
      // 마지막 공백 이후를 버전으로 간주
      const lastSpaceIndex = folderName.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        const gameName = folderName.substring(0, lastSpaceIndex).trim();
        const version = folderName.substring(lastSpaceIndex + 1).trim();
        return { gameName, version };
      } else {
        return { gameName: folderName, version: '알 수 없음' };
      }
    }
  };

  // 작가 이름 추출 (예: "작가 이름 (명작)"에서 작가 이름만 추출)
  const parseAuthorFolderName = (folderName) => {
    if (!folderName || typeof folderName !== 'string') {
      console.error('Invalid folderName:', folderName);
      return '알 수 없음';
    }
    const authorName = folderName.replace(/\(.*\)/, '').trim();
    return authorName;
  };

  // 폴더 열기 함수 수정
  const handleGoToFolder = (item) => {
    try {
      const { shell } = window.require('electron');
      const path = window.require('path');

      // 하드코딩된 베이스 경로 (필요에 따라 수정)
      const basePath = 'YOUR_DIRECTORY_PATH';

      // DesiredCategory7 카테고리 예외 처리
      if (item.fullPath.includes('DesiredCategory7/SubCategory1')) { // 예: Reality
        // SubCategory1 경로로 고정
        const subCategory1Path = path.join(basePath, 'SomeBase/DesiredCategory7/SubCategory1');
        console.log(`SubCategory1 Path: ${subCategory1Path}`);
        shell.openPath(subCategory1Path).then((result) => {
          if (result) {
            console.error(`폴더 열기 실패: ${result}`);
            alert(`폴더를 열 수 없습니다: ${result}`);
          }
        });
        return;
      }

      if (item.fullPath.includes('DesiredCategory7/SubCategory2')) { // 예: 3D
        // SubCategory2 경로로 고정
        const subCategory2Path = path.join(basePath, 'SomeBase/DesiredCategory7/SubCategory2');
        console.log(`SubCategory2 Path: ${subCategory2Path}`);
        shell.openPath(subCategory2Path).then((result) => {
          if (result) {
            console.error(`폴더 열기 실패: ${result}`);
            alert(`폴더를 열 수 없습니다: ${result}`);
          }
        });
        return;
      }

      // 나머지 경우: 하드코딩된 베이스 경로를 사용한 절대 경로 생성
      const absolutePath = path.join(basePath, item.fullPath);
      const normalizedPath = absolutePath.replace(/\\/g, '/');

      // 로그 출력
      console.log(`Base Path: ${basePath}`);
      console.log(`Item Full Path: ${item.fullPath}`);
      console.log(`Absolute Path: ${absolutePath}`);
      console.log(`Normalized Path: ${normalizedPath}`);

      // shell.openPath() 호출
      shell.openPath(normalizedPath).then((result) => {
        if (result) {
          console.error(`폴더 열기 실패: ${result}`);
          alert(`폴더를 열 수 없습니다: ${result}`);
        }
      });
    } catch (error) {
      console.error('폴더 열기 오류:', error);
      alert('폴더를 열 수 없습니다.');
    }
  };

  // 게임 아이템 렌더링 함수
  const renderGameItem = (category, item) => {
    if (!item || !item.name) {
      console.error(`Invalid item for category ${category}:`, item);
      return null;
    }

    let thumbnailSrc = '';
    let gameName = '';
    let version = '';
    let authorName = '';
    let itemKey = '';
    let modificationDate = '';

    if (category === 'RenPyCategory') { // '렌파이' -> 'RenPyCategory'
      // RenPy 게임
      const { gameName: name, version: ver } = parseGameFolderName(item.name);
      gameName = name;
      version = ver;
      thumbnailSrc = RenPyIcon;
      itemKey = `RenPy_${name}`;
      modificationDate = item.modificationDate
        ? new Date(item.modificationDate).toLocaleString()
        : '알 수 없음';
    } else if (category === 'DesiredCategory2') { // '미연시' -> 'DesiredCategory2'
      // DesiredCategory2 게임
      gameName = item.name;
      thumbnailSrc = MielImage;
      itemKey = `DesiredCategory2_${gameName}`;
      modificationDate = item.modificationDate
        ? new Date(item.modificationDate).toLocaleString()
        : '알 수 없음';
    } else if (category === 'DesiredCategory6') { // '동인' -> 'DesiredCategory6'
      // DesiredCategory6 작품
      authorName = parseAuthorFolderName(item.artist);
      gameName = item.name;
      thumbnailSrc = item.thumbnail || RenPyIcon;
      itemKey = `DesiredCategory6_${authorName}_${gameName}`;
      modificationDate = item.modificationDate
        ? new Date(item.modificationDate).toLocaleString()
        : '알 수 없음';
    } else if (category === 'DesiredCategory7') { // '포르노' -> 'DesiredCategory7'
      // DesiredCategory7 영상
      gameName = item.name;
      thumbnailSrc = item.thumbnail || XvideosPlaceholder; // 썸네일이 없을 경우 Placeholder 사용
      itemKey = `DesiredCategory7_${gameName}`;
      modificationDate = item.modificationDate
        ? new Date(item.modificationDate).toLocaleString()
        : '알 수 없음';
    } else {
      // 기타 카테고리
      gameName = item.name;
      thumbnailSrc = item.thumbnail || DefaultImage;
      itemKey = `${category}_${gameName}`;
      modificationDate = item.modificationDate
        ? new Date(item.modificationDate).toLocaleString()
        : '알 수 없음';
    }

    // 저장된 별점 가져오기
    const itemRating = ratings[category]?.[itemKey] || 0;

    // visibility 결정 based on displayLevel
    let showImage = false;
    let showTitle = false;
    let showStar = false;
    let imageStyle = {};

    switch (displayLevel) {
      case 2:
        showImage = false;
        showTitle = true;
        showStar = false;
        break;
      case 1:
        showImage = false;
        showTitle = true;
        showStar = true;
        break;
      case 0:
        showImage = true;
        showTitle = true;
        showStar = true;
        break;
      case -1:
        showImage = true;
        showTitle = true;
        showStar = false;
        imageStyle = { width: '120%' }; // 이미지 확대
        break;
      case -2:
        showImage = true;
        showTitle = false;
        showStar = false;
        imageStyle = { width: '150%' }; // 이미지 더 확대
        break;
      default:
        showImage = true;
        showTitle = true;
        showStar = true;
    }

    const handleImageClick = () => {
      setSelectedImage(thumbnailSrc);
      setIsImageModalOpen(true);
    };

    return (
      <GameItemContainer
        key={itemKey}
        ref={(el) => {
          if (el) {
            itemRefs.current[itemKey] = el;
          }
        }}
      >
        {/* displayLevel에 따라 이미지 표시 여부 및 크기 결정 */}
        {showImage && (
          <GameThumbnail
            src={thumbnailSrc}
            alt={gameName || authorName}
            style={imageStyle}
            onClick={handleImageClick}
          />
        )}
        <GameInfoContainer>
          {showTitle && <GameTitle>{gameName}</GameTitle>}
          {/* displayLevel에 따라 버전 및 작가 이름 표시 여부 결정 */}
          {(displayLevel === 1 || displayLevel === 0) && version && (
            <GameVersion>버전: {version}</GameVersion>
          )}
          {(displayLevel === 1 || displayLevel === 0) && authorName && (
            <AuthorName>작가 이름: {authorName}</AuthorName>
          )}
          {/* displayLevel에 따라 별점 표시 여부 결정 */}
          {showStar && (
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) =>
                star <= itemRating ? (
                  <FaStar
                    key={star}
                    onClick={() => handleRatingClick(category, itemKey, star)}
                    style={{ cursor: 'pointer', color: 'yellow' }}
                  />
                ) : (
                  <FaRegStar
                    key={star}
                    onClick={() => handleRatingClick(category, itemKey, star)}
                    style={{ cursor: 'pointer' }}
                  />
                )
              )}
            </StarRating>
          )}
          {/* 폴더로 가기 버튼 */}
          <GoToFolderButton onClick={() => handleGoToFolder(item)}>폴더로 가기</GoToFolderButton>
          {/* 수정일 표시 */}
          <ModificationDate>수정일: {modificationDate}</ModificationDate>
        </GameInfoContainer>
      </GameItemContainer>
    );
  };

  // toggleNodeMain 함수 정의
  const toggleNodeMain = (nodeName) => {
    setExpandedNodesMain((prev) => ({
      ...prev,
      [nodeName]: !prev[nodeName],
    }));
  };

  // toggleNodeModal 함수 정의
  const toggleNodeModal = (nodeName) => {
    setExpandedNodesModal((prev) => ({
      ...prev,
      [nodeName]: !prev[nodeName],
    }));
  };

  // 메인 콘텐츠 렌더링 함수
  const renderContent = () => {
    // activeFilter에 따라 표시할 카테고리 결정
    const filteredCategoryNames = activeFilter === '전체' ? categoryNames.slice(1) : [activeFilter];

    // Apply sorting
    const sortedCategoryFolders = JSON.parse(JSON.stringify(categoryFolders)); // Deep copy
    if (sortOption) {
      Object.keys(sortedCategoryFolders).forEach((category) => {
        if (sortedCategoryFolders[category]) {
          if (['DesiredCategory6', 'DesiredCategory7'].includes(category)) {
            Object.keys(sortedCategoryFolders[category]).forEach((sub) => {
              sortedCategoryFolders[category][sub].sort((a, b) => {
                if (sortOption === 'ㄱㄴㄷ 정렬') {
                  return a.name.localeCompare(b.name, 'ko');
                } else if (sortOption === 'ㄱㄴㄷ 역순 정렬') {
                  return b.name.localeCompare(a.name, 'ko');
                } else if (sortOption === 'abc 정렬') {
                  return a.name.localeCompare(b.name);
                } else if (sortOption === 'abc 역순 정렬') {
                  return b.name.localeCompare(a.name);
                } else if (sortOption === '최신순 정렬') {
                  return b.modificationDate - a.modificationDate;
                } else if (sortOption === '과거순 정렬') {
                  return a.modificationDate - b.modificationDate;
                } else {
                  return 0;
                }
              });
            });
          } else {
            sortedCategoryFolders[category].sort((a, b) => {
              if (sortOption === 'ㄱㄴㄷ 정렬') {
                return a.name.localeCompare(b.name, 'ko');
              } else if (sortOption === 'ㄱㄴㄷ 역순 정렬') {
                return b.name.localeCompare(a.name, 'ko');
              } else if (sortOption === 'abc 정렬') {
                return a.name.localeCompare(b.name);
              } else if (sortOption === 'abc 역순 정렬') {
                return b.name.localeCompare(a.name);
              } else if (sortOption === '최신순 정렬') {
                return b.modificationDate - a.modificationDate;
              } else if (sortOption === '과거순 정렬') {
                return a.modificationDate - b.modificationDate;
              } else {
                return 0;
              }
            });
          }
        }
      });
    }

    const contentSections = filteredCategoryNames.map((category) => {
      if (sortedCategoryFolders[category]) {
        if (category === 'DesiredCategory6' || category === 'DesiredCategory7') {
          // 'DesiredCategory6'과 'DesiredCategory7'은 하위 구조가 있음
          const subSections = Object.keys(sortedCategoryFolders[category]).map((subKey) => (
            <CategorySection
              key={subKey}
              ref={(el) => (categoryRefs.current[`${category}_${subKey}`] = el)}
            >
              <CategoryTitle onClick={() => toggleNodeMain(`${category}_${subKey}`)}>
                <NodeIcon>
                  {expandedNodesMain[`${category}_${subKey}`] ? <FaChevronDown /> : <FaChevronRight />}
                </NodeIcon>
                <CategoryTitleText>
                  {category} - {subKey}
                </CategoryTitleText>
              </CategoryTitle>
              {expandedNodesMain[`${category}_${subKey}`] && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {sortedCategoryFolders[category][subKey].map((item) =>
                    renderGameItem(category, item)
                  )}
                </div>
              )}
            </CategorySection>
          ));
          return (
            <CategorySection
              key={category}
              ref={(el) => (categoryRefs.current[category] = el)}
            >
              <CategoryTitle onClick={() => toggleNodeMain(category)}>
                <NodeIcon>
                  {expandedNodesMain[category] ? <FaChevronDown /> : <FaChevronRight />}
                </NodeIcon>
                <CategoryTitleText>{category}</CategoryTitleText>
              </CategoryTitle>
              {expandedNodesMain[category] && subSections}
            </CategorySection>
          );
        } else {
          // 기타 카테고리
          return (
            <CategorySection
              key={category}
              ref={(el) => (categoryRefs.current[category] = el)}
            >
              <CategoryTitle onClick={() => toggleNodeMain(category)}>
                <NodeIcon>
                  {expandedNodesMain[category] ? <FaChevronDown /> : <FaChevronRight />}
                </NodeIcon>
                <CategoryTitleText>{category}</CategoryTitleText>
              </CategoryTitle>
              {expandedNodesMain[category] && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {sortedCategoryFolders[category].map((item) => renderGameItem(category, item))}
                </div>
              )}
            </CategorySection>
          );
        }
      } else {
        return null;
      }
    });

    return <div>{contentSections}</div>;
  };

  // 트리 노드 렌더링 함수 (디렉토리 보기 모달용)
  const renderTree = (level, nodeName, parentCategory = null, isModal = false) => {
    const currentExpandedNodes = isModal ? expandedNodesModal : expandedNodesMain;
    const toggleNodeFunc = isModal ? toggleNodeModal : toggleNodeMain;

    if (level === 0) {
      // Root node
      return (
        <TreeContainer level={level} key={nodeName}>
          <TreeNode onClick={() => toggleNodeFunc(nodeName)}>
            <NodeIcon>
              {currentExpandedNodes[nodeName] ? <FaChevronDown /> : <FaChevronRight />}
            </NodeIcon>
            <NodeTitle>{nodeName}</NodeTitle>
          </TreeNode>
          {currentExpandedNodes[nodeName] && (
            <SubNodeList>
              {categoryNames.slice(1).map((category) =>
                categoryFolders[category] ? renderTree(level + 1, category, null, isModal) : null
              )}
            </SubNodeList>
          )}
        </TreeContainer>
      );
    } else if (level === 1) {
      // Category node
      return (
        <TreeContainer level={level} key={nodeName}>
          <TreeNode onClick={() => toggleNodeFunc(nodeName)}>
            <NodeIcon>
              {currentExpandedNodes[nodeName] ? <FaChevronDown /> : <FaChevronRight />}
            </NodeIcon>
            <NodeTitle>{nodeName}</NodeTitle>
          </TreeNode>
          {currentExpandedNodes[nodeName] && (
            <SubNodeList>
              {['DesiredCategory6', 'DesiredCategory7'].includes(nodeName)
                ? Object.keys(categoryFolders[nodeName]).map((key) =>
                    renderTree(level + 1, key, nodeName, isModal)
                  )
                : categoryFolders[nodeName].map((subfolder, index) => (
                    <TreeContainer level={level + 1} key={index}>
                      <TreeNode>
                        <NodeIcon>•</NodeIcon>
                        <NodeTitle>{subfolder.name}</NodeTitle>
                      </TreeNode>
                    </TreeContainer>
                  ))}
            </SubNodeList>
          )}
        </TreeContainer>
      );
    } else if (level === 2 && categoryFolders[parentCategory][nodeName]) {
      // 'DesiredCategory6' 또는 'DesiredCategory7' 카테고리의 하위 노드
      return (
        <TreeContainer level={level} key={nodeName}>
          <TreeNode onClick={() => toggleNodeFunc(nodeName)}>
            <NodeIcon>
              {currentExpandedNodes[nodeName] ? <FaChevronDown /> : <FaChevronRight />}
            </NodeIcon>
            <NodeTitle>{nodeName}</NodeTitle>
          </TreeNode>
          {currentExpandedNodes[nodeName] && (
            <SubNodeList>
              {categoryFolders[parentCategory][nodeName].map((item, index) => (
                <TreeContainer level={level + 1} key={index}>
                  <TreeNode>
                    <NodeIcon>•</NodeIcon>
                    <NodeTitle>{item.name}</NodeTitle>
                  </TreeNode>
                </TreeContainer>
              ))}
            </SubNodeList>
          )}
        </TreeContainer>
      );
    } else {
      return null;
    }
  };

  // 디렉토리 보기 모달 닫기
  const closeDirectoryModal = () => {
    setIsDirectoryModalOpen(false);
  };

  // 모두 펼치기 함수 (메인 화면)
  const handleExpandAll = () => {
    const newExpanded = { ...expandedNodesMain };
    newExpanded[connectedDirectory] = true;
    Object.keys(categoryFolders).forEach((category) => {
      newExpanded[category] = true;
      if (['DesiredCategory6', 'DesiredCategory7'].includes(category)) {
        Object.keys(categoryFolders[category]).forEach((sub) => {
          newExpanded[`${category}_${sub}`] = true;
        });
      }
    });
    setExpandedNodesMain(newExpanded);
  };

  // 모두 닫기 함수 (메인 화면)
  const handleCollapseAll = () => {
    const newExpanded = { ...expandedNodesMain };
    newExpanded[connectedDirectory] = false;
    Object.keys(categoryFolders).forEach((category) => {
      newExpanded[category] = false;
      if (['DesiredCategory6', 'DesiredCategory7'].includes(category)) {
        Object.keys(categoryFolders[category]).forEach((sub) => {
          newExpanded[`${category}_${sub}`] = false;
        });
      }
    });
    setExpandedNodesMain(newExpanded);
  };

  // 랜덤 선택 함수
  const handleRandomSelection = () => {
    // 모든 아이템을 수집
    const allItems = [];
    Object.keys(categoryFolders).forEach((category) => {
      if (category === 'DesiredCategory6' || category === 'DesiredCategory7') {
        Object.keys(categoryFolders[category]).forEach((sub) => {
          categoryFolders[category][sub].forEach((item) => {
            allItems.push({ category, subCategory: sub, itemKey: `${category}_${sub}_${item.name}` });
          });
        });
      } else {
        categoryFolders[category].forEach((item) => {
          allItems.push({ category, subCategory: null, itemKey: `${category}_${item.name}` });
        });
      }
    });

    if (allItems.length === 0) {
      alert('선택할 작품이 없습니다.');
      return;
    }

    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * allItems.length);
    const selected = allItems[randomIndex];

    // 스크롤 위치 업데이트
    const targetRef = itemRefs.current[selected.itemKey];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      alert(`랜덤으로 선택된 작품: ${selected.itemKey}`);
    } else {
      alert('작품을 찾을 수 없습니다.');
      console.error(`ItemRef not found for itemKey: ${selected.itemKey}`);
      console.log('All Items:', allItems);
    }
  };

  // 카테고리로 스크롤하는 함수
  const scrollToCategory = (category, subCategory = null) => {
    if (subCategory) {
      const ref = categoryRefs.current[`${category}_${subCategory}`];
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      const ref = categoryRefs.current[category];
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 정렬 옵션 선택 함수
  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setIsSortMenuVisible(false);
  };

  // 이미지 모달 닫기
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage('');
  };

  return (
    <AppContainer>
      <Header>
        <HeaderLeft>
          {/* 메인 메뉴 버튼 */}
          <MenuContainer ref={menuRef}>
            <MenuButton onClick={() => setIsMainMenuVisible(!isMainMenuVisible)}>
              <MenuButtonIcon>
                <FaBars />
              </MenuButtonIcon>
              <MenuButtonText>메뉴</MenuButtonText>
            </MenuButton>
            <DropdownMenu isVisible={isMainMenuVisible}>
              <MenuItem onClick={handleRestart}>프로그램 새로고침</MenuItem>
              <MenuItem onClick={handleExit}>프로그램 종료</MenuItem>
              <MenuItem onClick={handleReset}>초기화</MenuItem>
              <MenuItem onClick={() => setIsDirectoryModalOpen(true)}>디렉토리 보기</MenuItem>
            </DropdownMenu>
          </MenuContainer>

          {/* 축소 버튼 */}
          <MenuButton onClick={handleZoomOut}>
            <MenuButtonIcon>
              <FaMinus />
            </MenuButtonIcon>
            <MenuButtonText>축소</MenuButtonText>
          </MenuButton>

          {/* 확대 버튼 */}
          <MenuButton onClick={handleZoomIn}>
            <MenuButtonIcon>
              <FaPlus />
            </MenuButtonIcon>
            <MenuButtonText>확대</MenuButtonText>
          </MenuButton>

          {/* 필터링 버튼 */}
          <MenuContainer ref={filterRef}>
            <ActionButton onClick={toggleFilterMenu}>
              <ActionButtonIcon>
                <FaFilter />
              </ActionButtonIcon>
              <ActionButtonText>필터링</ActionButtonText>
            </ActionButton>
            <DropdownFilter isVisible={isFilterVisible}>
              {categoryNames.map((name) => (
                <FilterButton key={name} onClick={() => handleFilterButtonClick(name)}>
                  {name}
                </FilterButton>
              ))}
            </DropdownFilter>
          </MenuContainer>

          {/* '연결' 버튼 추가 */}
          <ActionButton onClick={handleConnect}>
            <ActionButtonIcon>
              <FaLink />
            </ActionButtonIcon>
            <ActionButtonText>연결</ActionButtonText>
          </ActionButton>

          {/* 정렬 버튼 */}
          <MenuContainer ref={sortMenuRef}>
            <ActionButton onClick={() => setIsSortMenuVisible(!isSortMenuVisible)}>
              <ActionButtonIcon>
                <FaSort />
              </ActionButtonIcon>
              <ActionButtonText>정렬</ActionButtonText>
            </ActionButton>
            <DropdownMenu isVisible={isSortMenuVisible}>
              <MenuItem onClick={() => handleSortOptionSelect('ㄱㄴㄷ 정렬')}>
                ㄱㄴㄷ 정렬
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionSelect('ㄱㄴㄷ 역순 정렬')}>
                ㄱㄴㄷ 역순 정렬
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionSelect('abc 정렬')}>
                abc 정렬
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionSelect('abc 역순 정렬')}>
                abc 역순 정렬
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionSelect('최신순 정렬')}>
                최신순 정렬
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionSelect('과거순 정렬')}>
                과거순 정렬
              </MenuItem>
            </DropdownMenu>
          </MenuContainer>
        </HeaderLeft>

        <HeaderCenter>
          <GameInfo>등록된 작품: {registeredWorks}</GameInfo>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="검색하기"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </SearchContainer>
        </HeaderCenter>

        <HeaderRight>
          {/* '초기화' 버튼 */}
          <MenuButton onClick={handleRestart}>
            <MenuButtonIcon>
              <FaSyncAlt />
            </MenuButtonIcon>
            <MenuButtonText>초기화</MenuButtonText>
          </MenuButton>
        </HeaderRight>
      </Header>

      <Content>
        <MainContent>
          {/* 로딩 프로그레스 바 */}
          {loadingProgress > 0 && loadingProgress < 100 && (
            <ProgressBarContainer>
              <ProgressBar progress={loadingProgress} />
              <ProgressText>{loadingProgress}%</ProgressText>
            </ProgressBarContainer>
          )}

          {/* 버튼을 MainContent 상단에 배치하여 'DesiredCategory1' 위에 위치시킵니다. */}
          <TopButtonsContainer>
            <TopButton onClick={handleExpandAll}>모두 펼치기</TopButton>
            <TopButton onClick={handleCollapseAll}>모두 닫기</TopButton>
            <TopButton onClick={handleRandomSelection}>랜덤 선택하기</TopButton>
            {/* 빠른 이동 버튼 추가 */}
            <QuickNavContainer ref={quickNavRef}>
              <TopButton onClick={() => setIsQuickNavVisible(!isQuickNavVisible)}>
                빠른 이동
              </TopButton>
              <QuickNavDropdown isVisible={isQuickNavVisible}>
                {categoryNames.slice(1).map((name) => (
                  <QuickNavButton key={name} onClick={() => {
                    scrollToCategory(name);
                    setIsQuickNavVisible(false);
                  }}>
                    {name}
                  </QuickNavButton>
                ))}
              </QuickNavDropdown>
            </QuickNavContainer>
          </TopButtonsContainer>

          {/* 카테고리 리스트 */}
          {connectedDirectory ? (
            renderContent()
          ) : (
            <p>연결된 디렉토리가 없습니다.</p>
          )}
        </MainContent>
      </Content>

      {/* 디렉토리 보기 모달 */}
      <Modal
        isOpen={isDirectoryModalOpen}
        onRequestClose={closeDirectoryModal}
        style={customModalStyles}
        contentLabel="디렉토리 보기"
      >
        <Header>
          <HeaderLeft>
            <h2>디렉토리 보기</h2>
          </HeaderLeft>
          <HeaderRight>
            <MenuButton onClick={closeDirectoryModal} style={{ width: '40px', height: '40px' }}>
              <FaTimes />
            </MenuButton>
          </HeaderRight>
        </Header>
        <div>
          {connectedDirectory && renderTree(0, connectedDirectory, null, true)}
        </div>
      </Modal>

      {/* 이미지 보기 모달 */}
      <Modal
        isOpen={isImageModalOpen}
        onRequestClose={closeImageModal}
        style={{
          content: {
            ...customModalStyles.content,
            padding: '0',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          overlay: customModalStyles.overlay,
        }}
        contentLabel="이미지 보기"
      >
        <img
          src={selectedImage}
          alt="Selected"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
          onClick={closeImageModal}
        />
      </Modal>

      {/* 플로팅 버튼 */}
      <FloatingContainer>
        <FloatingButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FaAngleDoubleUp />
        </FloatingButton>
        <FloatingButton onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
          <FaAngleDoubleDown />
        </FloatingButton>
      </FloatingContainer>
    </AppContainer>
  );
};

// 플로팅 버튼 스타일
const FloatingContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const FloatingButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  margin-top: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #444;
  }
`;

// 로딩 프로그레스 바 스타일
const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #333;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
`;

const ProgressBar = styled.div`
  width: ${({ progress }) => progress}%;
  height: 20px;
  background-color: #4caf50;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 12px;
  line-height: 20px;
`;

export default App;
