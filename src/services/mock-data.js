export const mockMindmapData = {
  parent_content: [
    {
      branch: "branch_1",
      children: [
        {
          branch: "branch_2",
          children: [
            {
              branch: "branch_2_1",
              children: [],
              content: "Đây là nhánh con 2.1 của nhánh 2, nói về sự lan rộng của máy hơi nước sang các ngành khác.",
              parent: "branch_2"
            },
            {
              branch: "branch_2_2",
              children: [],
              content: "Nhánh con 2.2: Ảnh hưởng của máy hơi nước đến giao thông vận tải và thương mại.",
              parent: "branch_2"
            }
          ],
          content: "Cách mạng bắt đầu ở Anh vào cuối thế kỷ 18, với sự phát minh ra máy hơi nước của James Watt. Điều này dẫn đến sự ra đời của các nhà máy cơ khí đầu tiên và làm thay đổi hoàn toàn phương thức sản xuất.",
          parent: "branch_1"
        },
        {
          branch: "branch_3",
          children: [
            {
              branch: "branch_3_1",
              children: [
                {
                  branch: "branch_3_1_1",
                  children: [],
                  content: "Đây là nhánh con 3.1.1, nói về các phong trào công nhân đầu thế kỷ 19.",
                  parent: "branch_3_1"
                }
              ],
              content: "Nhánh con 3.1: Sự hình thành các tổ chức công nhân đầu tiên.",
              parent: "branch_3"
            }
          ],
          content: "Tiếp theo, thầy nói về ảnh hưởng của cách mạng công nghiệp đến xã hội: nhiều người rời bỏ nông thôn để làm việc trong các nhà máy ở thành phố, dẫn đến quá trình đô thị hóa nhanh chóng. Tuy nhiên, điều này cũng gây ra nhiều vấn đề như ô nhiễm, điều kiện làm việc tồi tệ và bóc lột sức lao động.",
          parent: "branch_1"
        },
        {
          branch: "branch_4",
          children: [],
          content: "Cuối buổi, lớp thảo luận về mối liên hệ giữa cách mạng công nghiệp và sự hình thành giai cấp công nhân hiện đại. Giảng viên khuyến khích sinh viên tìm hiểu thêm về các phong trào công nhân ở thế kỷ 19 như Công xã Paris và Phong trào Chartist.",
          parent: "branch_1"
        }
      ],
      content: "Trong buổi học hôm nay, giảng viên trình bày về cách mạng công nghiệp lần thứ nhất.",
      parent: null
    },
    {
      branch: "branch_5",
      children: [
        {
          branch: "branch_6",
          children: [
            {
              branch: "branch_6_1",
              children: [],
              content: "Nhánh con 6.1: Các thành phần chính của một hệ thống máy tính.",
              parent: "branch_6"
            },
            {
              branch: "branch_6_2",
              children: [],
              content: "Nhánh con 6.2: Vai trò của CPU trong xử lý dữ liệu.",
              parent: "branch_6"
            }
          ],
          content: "Phần cứng máy tính bao gồm các thành phần vật lý như CPU, RAM, ổ cứng, bo mạch chủ và các thiết bị ngoại vi.",
          parent: "branch_5"
        },
        {
          branch: "branch_7",
          children: [
            {
              branch: "branch_7_1",
              children: [],
              content: "Nhánh con 7.1: Hệ điều hành và các chức năng cơ bản.",
              parent: "branch_7"
            }
          ],
          content: "Phần mềm máy tính bao gồm hệ điều hành, ứng dụng và các chương trình tiện ích.",
          parent: "branch_5"
        }
      ],
      content: "Buổi học về cấu trúc cơ bản của máy tính.",
      parent: null
    },
    {
      branch: "branch_8",
      children: [
        {
          branch: "branch_9",
          children: [
            {
              branch: "branch_9_1",
              children: [],
              content: "Nhánh con 9.1: Các loại tế bào thần kinh và chức năng của chúng.",
              parent: "branch_9"
            },
            {
              branch: "branch_9_2",
              children: [],
              content: "Nhánh con 9.2: Quá trình truyền tín hiệu thần kinh.",
              parent: "branch_9"
            }
          ],
          content: "Hệ thần kinh trung ương bao gồm não và tủy sống, đóng vai trò điều khiển mọi hoạt động của cơ thể.",
          parent: "branch_8"
        },
        {
          branch: "branch_10",
          children: [
            {
              branch: "branch_10_1",
              children: [],
              content: "Nhánh con 10.1: Các loại hormone và tác dụng của chúng.",
              parent: "branch_10"
            }
          ],
          content: "Hệ nội tiết sản xuất các hormone điều hòa các quá trình sinh lý trong cơ thể.",
          parent: "branch_8"
        }
      ],
      content: "Bài giảng về hệ thần kinh và hệ nội tiết của con người.",
      parent: null
    }
  ],
  total_branches: 15
}; 