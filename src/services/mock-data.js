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
    }
  ],
  total_branches: 15
}; 