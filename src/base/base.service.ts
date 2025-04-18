// core/services/base.service.ts
import { Role } from "@prisma/client";
import { HttpContextService } from "src/common/services/http-context.service";
import { NotificationService } from "src/common/services/notification.service";
import { CoreService } from "src/core/core.service";
import { Notification } from "src/model/entity/notification.entity";
import { PageRequest } from "src/model/request/page.request";
import { PageResult } from "src/model/response/page.response";
import { PrismaService } from "src/repo/prisma.service";


export class BaseService<T extends { id: number }, K> {
  protected readonly _mapperService;
  protected readonly _emailService;
  protected readonly _authService: HttpContextService;
  protected readonly _notificationService: NotificationService;
  protected repository: any;
  protected readonly entityFactory: new () => K;
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly coreService: CoreService) {
    this._mapperService = coreService.getMapperSerivce();
    this._emailService = coreService.getEmailService();
    this._authService = coreService.getAuthService();
    this._notificationService = coreService.getNotificationService();
  }

  setRepo(modelName: string) {
    this.repository = this.prismaService.createRepo<T, K>(modelName, this.prismaService.getModelByType(modelName));
  }

  // // Tạo mới entity
  async add(entity: T): Promise<number> {
    var result = await this.repository.create(entity, {
      select: {
        id: true
      }
    }, this.getMoreCreateData());
    return Number(result.id);
  }

  async getById(id: number): Promise<T> {
    const data = await this.repository.findOneWithCondition({
      id
    });
    this.afterGetData(data);
    return data;
  }

  // Lấy entity theo filter và các thuộc tính liên quan
  async getOne(conditions: { [key: string]: any }): Promise<T> {
    const data = await this.repository.findOneWithCondition(conditions);
    this.afterGetData(data);
    return data;
  }

  async getOneAndReference(conditions: { [key: string]: any }, includeReferences: { [key: string]: boolean } = {}): Promise<T> {
    const data = await this.repository.findOneWithConditionAndGetReference(conditions, includeReferences);
    this.afterGetData(data);
    return data;
  }

  async getMany(conditions: { [key: string]: any }): Promise<T[]> {
    const data = await this.repository.findManyWithCondition(conditions);
    this.afterGetDatas(data);
    return data;
  }

  // Xóa entity
  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  // Xóa Danh sách Entity theo IDs
  async removeIDs(ids: number[]): Promise<void> {
    await this.repository.deleteByIds(ids);
  }

  // Cập nhật entity
  async update(id: number, model: Partial<T>): Promise<boolean> {
    await this.repository.update(id, model, this.getMoreUpdateData());
    return true;
  }

  async updateMany(conditions: { [key: string]: any }, data): Promise<boolean> {
    await this.repository.updateMany(conditions, data);
    return true;
  }

  async updateMultiple(updates: { id: number, model: Partial<T> }[]): Promise<number> {
    const me = this;
    const updatePromises = updates.map(update => {
      return this.repository.update(update.id, update.model, me.getMoreUpdateData());
    });

    // Thực thi tất cả các cập nhật cùng lúc
    const results = await Promise.all(updatePromises);
    return results.length; // Trả về số lượng bản ghi đã cập nhật thành công
  }

  // Lấy dữ liệu phân trang
  async getPaging(pageRequest: PageRequest): Promise<PageResult<T>> {
    const pagingData = await this.repository.getPaging(pageRequest, false);
    this.afterGetDatas(pagingData.data);
    return pagingData;
  }

  protected afterGetDatas(entities: T[]): void {

  }
  protected afterGetData(entity: T): void {
  }

  protected getMoreCreateData() {
    return {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: this._authService?.getFullname() || 'system', // Nếu không truyền vào thì lấy 'system'
      updatedBy: this._authService?.getFullname() || 'system',
    };
  }

  protected getMoreUpdateData() {
    return {
      updatedAt: new Date(),
      updatedBy: this._authService?.getFullname() || 'system',
    };
  }


  //#region  Notificaiton
  async pushNotification(
    receiveId: number,
    type: string,
    rawData: string,
    createdBy: string,
    senderID: number,
  ): Promise<boolean> {
    const notification = new Notification();
    notification.receiveId = receiveId;
    notification.type = type;
    notification.rawData = rawData;
    notification.createdAt = new Date();
    notification.updatedAt = new Date();
    notification.createdBy = createdBy;
    notification.updatedBy = createdBy;
    notification.senderId = senderID;
    notification.senderName = createdBy;
    notification.isViewed = false;

    this.beforePushNotification(notification);
    const path = this.getPathPushNotification(notification);

    const notificationData = await this.prismaService.notification.create({
      data: {
        ...notification
      }
    });
    notification.id = notificationData.id;
    await this._notificationService.pushNotification(notification, path);

    this.afterPushNotification(notification);

    return true;
  }

  async pushNotificationToAdmin(
    type: string,
    rawData: string,
    createdBy: string,
    senderID: number,
  ): Promise<boolean> {
    const adminUsers = await this.prismaService.userRepo.getUserByRole(Role.ADMIN);
    if (adminUsers && adminUsers.length > 0) {
      await Promise.all(
        adminUsers.map((user) =>
          this.pushNotification(user.id, type, rawData, createdBy, senderID),
        ),
      );
    }
    return true;
  }

  async pushNotificationToProductOnwer(
    type: string,
    rawData: string,
    createdBy: string,
    senderID: number,
  ): Promise<boolean> {
    const users = await this.prismaService.userRepo.getUserByRole(Role.OWNER);
    if (users && users.length > 0) {
      await Promise.all(
        users.map((user) =>
          this.pushNotification(user.id, type, rawData, createdBy, senderID),
        ),
      );
    }
    return true;
  }

  protected beforePushNotification(notification: Notification): void {
    // Thực hiện logic trước khi gửi thông báo nếu cần
  }

  protected afterPushNotification(notification: Notification): void {
    // Thực hiện logic sau khi gửi thông báo nếu cần
  }

  protected getPathPushNotification(notification: Notification): string {
    return `${notification.receiveId}/push`;
  }
  //#endregion

}
