// https://payos.vn/docs/du-lieu-tra-ve/return-url/

export class ReturnURLRequest {
    /**
     * true: Đã hủy thanh toán
     * false: đã thanh toán hoặc chờ thành toán
     */
    cancel: string
    /**
     * 00: Thành công
     * 01: Invalid Param
     */
    code: string
    /**
     * string
     */
    id: string
    orderCode: string
    /**
     * PAID - Đã thanh toán
        PENDING - Chờ thanh toán
        PROCESSING - Đang xử lý
        CANCELLED - Đã hủy
     * 
     */
    status:string
    constructor() {
        this.cancel = "false";
        this.code = "00";
        this.id = "";
        this.orderCode = "";
        this.status = "";
    }
}
