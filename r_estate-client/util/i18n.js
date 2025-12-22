import i18next from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        debug: false,
        fallbackLng: 'vi',
        resources: {
            vi: {
                translation: {
                    // Auth & General
                    sign_in: "Đăng nhập",
                    sign_in_google: "Đăng nhập với Google",
                    sign_in_message: "Đang đăng nhập vào tài khoản",
                    sign_in_control_message: "Đang kiểm tra quyền truy cập...",
                    fetch_data_message: "Đang tải dữ liệu...",
                    loading_message: "Vui lòng chờ...",
                    loading_process_button: "Đang xử lý...",
                    
                    // Home Page
                    main_post_text1: "Mua hoặc bán bất động sản nhanh chóng",
                    main_post_text2: "và an toàn với R-Estate",
                    main_post_text3: "Bắt đầu thực hiện các",
                    main_post_text4: "giao dịch bất động sản của bạn",
                    main_post_text5: "tiết kiệm thời gian và bảo mật hơn",
                    main_post_link: "Xem ngay",
                    
                    middle_post_title: "Tham gia vào sự đổi mới",
                    middle_post_content: "R-Estate hướng tới việc loại bỏ những khó khăn của phương pháp truyền thống. " +
                                         "Đóng góp lớn nhất cho ngành bất động sản là giải quyết vấn đề " +
                                         "niềm tin nhờ vào cơ sở hạ tầng Blockchain. " +
                                         "Đồng thời, chúng tôi tối ưu trải nghiệm người dùng bằng một " +
                                         "giao diện đơn giản, hiện đại và dễ hiểu.",
                    
                    small_posts_title: "Khám phá thị trường bất động sản",
                    small_post1_title: "Không cần trung gian",
                    small_post1_desc: "Bạn không cần đặt niềm tin vào bất kỳ ai trong quá trình mua bán, R-Estate loại bỏ hoàn toàn các bên trung gian.",
                    small_post2_title: "Bảo chứng Blockchain",
                    small_post2_desc: "Mọi giao dịch đều diễn ra trên hạ tầng Ethereum. Mỗi giao dịch đều được lưu vết vĩnh viễn trên chuỗi khối.",
                    small_post3_title: "Loại bỏ thủ tục rườm rà",
                    small_post3_desc: "Không còn các quy trình giấy tờ phức tạp. Bạn có thể giao dịch nhanh chóng vì R-Estate đưa mọi thứ về một nền tảng duy nhất.",

                    // Navbar
                    navbar_home: "Trang chủ",
                    navbar_profile: "Hồ sơ",
                    navbar_sale_properties: "BĐS đang rao bán",
                    navbar_sell_property: "Đăng tin bán",
                    navbar_logout: "Đăng xuất",
                    navbar_properties_page: "Danh mục tài sản",

                    // Marketplace & Search
                    main_page_adv_line1: "Tìm kiếm ngôi nhà lý tưởng",
                    main_page_adv_line2: "& Cơ hội đầu tư",
                    location_field: "Địa điểm",
                    type_field: "Loại hình",
                    search_button: "Tìm kiếm",
                    reset_query_button: "Đặt lại",
                    price_field: "Giá",
                    buy_property_button: "Mua ngay",

                    // Wallet
                    connect_wallet_button: "Kết nối ví",
                    disconnect_wallet_button: "Ngắt kết nối",
                    connect_wallet_message: "Bạn cần kết nối ví để tiếp tục",
                    sale_properties_connect_wallet_message: "Vui lòng kết nối ví từ trang hồ sơ trước khi tiếp tục",
                    sale_properties_connect_wallet_button: "Đi tới trang Hồ sơ",

                    // Property Details
                    property_info1: "Tổng quan",
                    property_info2: "Đặc điểm tài sản",
                    property_info3: "Mô tả chi tiết",
                    property_type_field: "Loại bất động sản",
                    bedroom_field: "Phòng ngủ",
                    bathroom_field: "Phòng tắm",
                    living_area_field: "Diện tích (m2)",
                    pool_field: "Hồ bơi",

                    // Profile
                    profile_name_field: "Họ và tên",
                    profile_walletAddress_field: "Địa chỉ ví",
                    profile_walletAddress_message: "Chưa có địa chỉ ví nào được kết nối",

                    // Sell Property Page
                    sell_property_page_title: "Để bán tài sản, trước tiên hãy kiểm tra chứng nhận quyền sở hữu (Deed)",
                    sell_property_property_number_field: "Mã số tài sản",
                    sell_property_property_code_field: "Mã khóa bí mật tài sản",
                    sell_property_check_button: "Kiểm tra quyền sở hữu",
                    
                    sell_property_detail_page_title: "Nhập thông tin bất động sản",
                    sell_property_detail_image_field: "Nhấn để thêm ảnh",
                    sell_property_detail_property_title_field: "Tiêu đề tin đăng",
                    sell_property_detail_preview_field: "Thông tin xem trước",
                    sell_property_detail_inform_field: "Mô tả chi tiết về bất động sản",
                    sell_property_detail_page_title2: "Tiện ích tài sản",
                    sell_property_detail_bathroom_field: "Số phòng tắm",
                    sell_property_detail_bedroom_field: "Số phòng ngủ",
                    sell_property_detail_button: "Hoàn tất đăng tin",
                    sell_property_detail_price_message: "Giá không được thấp hơn giá trị thực tế! Giá thực tế: ",
                    sell_property_detail_image_message: "Bạn phải chọn tệp hình ảnh",
                    sell_property_detail_image_length_message: "Bạn cần chọn ít nhất 2 và tối đa 5 ảnh",

                    // Notifications / Toast
                    toast_balance_message: "Số dư không đủ",
                    toast_bought_message: "Mua bất động sản thành công!",
                    toast_listed_message: "Tài sản đã được niêm yết thành công!",
                    footer_title: "Liên hệ với chúng tôi",
                    sale_properties_page_title: "Tài sản đã niêm yết",
                    sale_properties_number_field: "Mã số",
                    sale_properties_is_sold_field: "Trình trạng",
                }
            }
        }
    });

export default i18next;