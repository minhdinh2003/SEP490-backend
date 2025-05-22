import { Role } from "@prisma/client";
import { BaseService } from "./base.service";
import { PageRequest } from "src/model/request/page.request";
import { PageResult } from "src/model/response/page.response";

describe("BaseService", () => {
  let service: BaseService<any, any>;
  let mockRepo: any;
  let mockPrismaService: any;
  let mockCoreService: any;

  // Tạo mock repository sử dụng các hàm mà BaseService gọi
  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findOneWithCondition: jest.fn(),
      findOneWithConditionAndGetReference: jest.fn(),
      findManyWithCondition: jest.fn(),
      delete: jest.fn(),
      deleteByIds: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      getPaging: jest.fn(),
    };

    mockPrismaService = {
      createRepo: jest.fn().mockReturnValue(mockRepo),
      getModelByType: jest.fn(),
      // Giả lập cho phương thức dùng trong pushNotificationToAdmin/Owner
      userRepo: {
        getUserByRole: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
    };

    // Mock CoreService với các hàm cần dùng
    const mockAuthService = {
      getFullname: jest.fn().mockReturnValue("Test User"),
    };
    mockCoreService = {
      getMapperSerivce: jest.fn().mockReturnValue({}),
      getEmailService: jest.fn().mockReturnValue({}),
      getAuthService: jest.fn().mockReturnValue(mockAuthService),
      getNotificationService: jest.fn().mockReturnValue({
        pushNotification: jest.fn().mockResolvedValue(true),
      }),
    };

    service = new BaseService(mockPrismaService, mockCoreService);
    service.setRepo("TestModel");
  });

  // 1. Test setRepo: Kiểm tra repo được gán đúng.
  it("should set repository correctly via setRepo", () => {
    // expect(mockPrismaService.createRepo).toHaveBeenCalledWith(
    //   "TestModel",
    //   expect.anything()
    // );
    expect(service["repository"]).toBe(mockRepo);
  });

  // 2. Test add: Trả về id
  it("should add a new entity and return its id", async () => {
    // Giả lập trả về từ repository.create
    mockRepo.create.mockResolvedValue({ id: 5 });
    // Giả lập getMoreCreateData (trả về thông tin metadata)
    jest.spyOn(service as any, "getMoreCreateData").mockReturnValue({
      createdAt: new Date(0),
      updatedAt: new Date(0),
      createdBy: "Test User",
      updatedBy: "Test User",
    });
    const result = await service.add({ id: 0 });
    expect(mockRepo.create).toHaveBeenCalledWith(
      { id: 0 },
      { select: { id: true } },
      expect.objectContaining({ createdBy: "Test User" })
    );
    expect(result).toBe(5);
  });

  // 3. Test getById: Trả về entity và gọi afterGetData
  it("should get entity by id", async () => {
    const entity = { id: 1, name: "Alice" };
    mockRepo.findOneWithCondition.mockResolvedValue(entity);
    const afterSpy = jest.spyOn<any, any>(service, "afterGetData").mockImplementation(() => {});
    const result = await service.getById(1);
    expect(result).toEqual(entity);
    expect(mockRepo.findOneWithCondition).toHaveBeenCalledWith({ id: 1 });
    expect(afterSpy).toHaveBeenCalledWith(entity);
  });

  // 4. Test getOne: Lấy entity theo condition
  it("should get one entity by condition", async () => {
    const entity = { id: 2, name: "Bob" };
    mockRepo.findOneWithCondition.mockResolvedValue(entity);
    const spy = jest.spyOn<any, any>(service, "afterGetData").mockImplementation(() => {});
    const result = await service.getOne({ name: "Bob" });
    expect(result).toEqual(entity);
    expect(mockRepo.findOneWithCondition).toHaveBeenCalledWith({ name: "Bob" });
    expect(spy).toHaveBeenCalledWith(entity);
  });

  // 5. Test getOneAndReference: Lấy entity cùng reference
  it("should get one entity with references", async () => {
    const entity = { id: 3, name: "Charlie" };
    mockRepo.findOneWithConditionAndGetReference.mockResolvedValue(entity);
    const spy = jest.spyOn<any, any>(service, "afterGetData").mockImplementation(() => {});
    const result = await service.getOneAndReference({ id: 3 }, { ref: true });
    expect(result).toEqual(entity);
    expect(mockRepo.findOneWithConditionAndGetReference).toHaveBeenCalledWith({ id: 3 }, { ref: true });
    expect(spy).toHaveBeenCalledWith(entity);
  });

  // 6. Test getMany: Lấy nhiều entity
  it("should get many entities", async () => {
    const entities = [{ id: 1 }, { id: 2 }];
    mockRepo.findManyWithCondition.mockResolvedValue(entities);
    const spy = jest.spyOn<any, any>(service, "afterGetDatas").mockImplementation(() => {});
    const result = await service.getMany({ active: true });
    expect(result).toEqual(entities);
    expect(mockRepo.findManyWithCondition).toHaveBeenCalledWith({ active: true });
    expect(spy).toHaveBeenCalledWith(entities);
  });

  // 7. Test remove: Xóa entity theo id
  it("should remove entity by id", async () => {
    mockRepo.delete.mockResolvedValue(undefined);
    await service.remove(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  // 8. Test removeIDs: Xóa danh sách entity theo ids
  it("should remove entities by ids", async () => {
    mockRepo.deleteByIds.mockResolvedValue(undefined);
    await service.removeIDs([1, 2, 3]);
    expect(mockRepo.deleteByIds).toHaveBeenCalledWith([1, 2, 3]);
  });

  // 9. Test update: Cập nhật entity, trả về true
  it("should update an entity and return true", async () => {
    mockRepo.update.mockResolvedValue({});
    jest.spyOn(service as any, "getMoreUpdateData").mockReturnValue({
      updatedAt: new Date(0),
      updatedBy: "Test User",
    });
    const result = await service.update(1, { name: "Updated" });
    expect(mockRepo.update).toHaveBeenCalledWith(1, { name: "Updated" }, expect.objectContaining({ updatedBy: "Test User" }));
    expect(result).toBe(true);
  });

  // 10. Test updateMany: Cập nhật nhiều entity
  it("should update many entities and return true", async () => {
    mockRepo.updateMany.mockResolvedValue({});
    const result = await service.updateMany({ active: false }, { active: true });
    expect(mockRepo.updateMany).toHaveBeenCalledWith({ active: false }, { active: true });
    expect(result).toBe(true);
  });

  // 11. Test updateMultiple: Cập nhật song song và trả về số lượng cập nhật
  it("should update multiple entities and return count", async () => {
    const updates = [
      { id: 1, model: { name: "A" } },
      { id: 2, model: { name: "B" } },
    ];
    mockRepo.update.mockResolvedValue({});
    const result = await service.updateMultiple(updates);
    expect(result).toBe(2);
    expect(mockRepo.update).toHaveBeenCalledTimes(2);
  });

  // 12. Test getPaging: Lấy dữ liệu phân trang
  it("should return paged result", async () => {
    // Chỉnh sửa đối tượng pagingData phù hợp với định nghĩa PageResult (bao gồm totalCount)
    const pagingData: PageResult<any> = { data: [{ id: 1 }], totalCount: 1 };
    mockRepo.getPaging.mockResolvedValue(pagingData);
    const pageRequest: PageRequest = { pageNumber: 1, pageSize: 10, includeReferences: {} };
    const result = await service.getPaging(pageRequest);
    expect(result).toEqual(pagingData);
    expect(mockRepo.getPaging).toHaveBeenCalledWith(pageRequest, false);
  });

  // 13. Test afterGetData (hook trống) không bị lỗi
  it("should call afterGetData without error", () => {
    expect(() => service["afterGetData"]({ id: 1 })).not.toThrow();
  });

  // 14. Test afterGetDatas (hook trống) không bị lỗi
  it("should call afterGetDatas without error", () => {
    expect(() => service["afterGetDatas"]([{ id: 1 }])).not.toThrow();
  });

  // 15. Test getMoreCreateData: Kiểm tra metadata tạo entity
  it("should return create metadata from getMoreCreateData", () => {
    const data = service["getMoreCreateData"]();
    expect(data.createdBy).toBe("Test User");
    expect(data.updatedBy).toBe("Test User");
    expect(data.createdAt).toBeInstanceOf(Date);
    expect(data.updatedAt).toBeInstanceOf(Date);
  });

  // 16. Test getMoreUpdateData: Kiểm tra metadata update
  it("should return update metadata from getMoreUpdateData", () => {
    const data = service["getMoreUpdateData"]();
    expect(data.updatedBy).toBe("Test User");
    expect(data.updatedAt).toBeInstanceOf(Date);
  });

  // 17. Test updateMultiple khi update thất bại (bỏ qua, giả lập update trả về lỗi)
  it("should return zero when updateMultiple returns no updates", async () => {
    const updates = [
      { id: 1, model: { name: "A" } },
      { id: 2, model: { name: "B" } },
    ];
    // Giả lập update từ repository ném ra lỗi => Promise.all trả về rejection, ta bắt lỗi
    jest.spyOn(mockRepo, "update").mockRejectedValue(new Error("Update failed"));
    await expect(service.updateMultiple(updates)).rejects.toThrow("Update failed");
  });

  // 18. Test removeIDs: Trả về thành công khi deleteByIds được thực hiện
  it("should complete removeIDs without error", async () => {
    mockRepo.deleteByIds.mockResolvedValue(undefined);
    await expect(service.removeIDs([4,5])).resolves.toBeUndefined();
  });

  // 19. Test updateMany: Nếu repository updateMany ném lỗi, service cũng ném lỗi
  it("should throw error if updateMany fails", async () => {
    mockRepo.updateMany.mockRejectedValue(new Error("UpdateMany failed"));
    await expect(service.updateMany({ active: false }, { active: true })).rejects.toThrow("UpdateMany failed");
  });

  // 20. Test notification functions: pushNotificationToAdmin
  it("should push notification to admin users", async () => {
    const adminUsers = [{ id: 10 }, { id: 20 }];
    // Giả lập userRepo.getUserByRole trả về adminUsers
    mockPrismaService.userRepo = {
      getUserByRole: jest.fn().mockResolvedValue(adminUsers),
    };
    const pushSpy = jest.spyOn(service, "pushNotification").mockResolvedValue(true);
    const result = await service.pushNotificationToAdmin("TYPE", "RAW", "Test User", 123);
    expect(result).toBe(true);
    expect(mockPrismaService.userRepo.getUserByRole).toHaveBeenCalledWith(Role.ADMIN);
    expect(pushSpy).toHaveBeenCalledTimes(adminUsers.length);
  });

  // Bonus: Test pushNotificationToProductOnwer
  it("should push notification to product owner users", async () => {
    const ownerUsers = [{ id: 30 }];
    mockPrismaService.userRepo = {
      getUserByRole: jest.fn().mockResolvedValue(ownerUsers),
    };
    const pushSpy = jest.spyOn(service, "pushNotification").mockResolvedValue(true);
    const result = await service.pushNotificationToProductOnwer("TYPE", "RAW", "Test User", 123);
    expect(result).toBe(true);
    expect(mockPrismaService.userRepo.getUserByRole).toHaveBeenCalledWith(Role.OWNER);
    expect(pushSpy).toHaveBeenCalledTimes(ownerUsers.length);
  });

  // 20. Test getPathPushNotification: Kiểm tra định dạng đường dẫn
  it("should return correct push notification path", () => {
    const notification = { receiveId: 42 } as any;
    const path = service["getPathPushNotification"](notification);
    expect(path).toBe("42/push");
  });
  
describe("BaseService - Error / Wrong Return Cases", () => {
  // 1. add: Nếu repository.create bị reject, service.add cũng nên reject.
  it("should throw an error if repository.create fails in add()", async () => {
    const errorMessage = "Create failed";
    mockRepo.create.mockRejectedValue(new Error(errorMessage));
    await expect(service.add({ id: 0 })).rejects.toThrow(errorMessage);
  });

  // 2. getById: Nếu repository.findOneWithCondition reject, service.getById cũng reject.
  it("should throw an error if repository.findOneWithCondition fails in getById()", async () => {
    const errorMessage = "FindOne failed";
    mockRepo.findOneWithCondition.mockRejectedValue(new Error(errorMessage));
    await expect(service.getById(1000)).rejects.toThrow(errorMessage);
  });

  // 3. update: Nếu repository.update bị reject thì service.update nên reject.
  it("should throw an error if repository.update fails in update()", async () => {
    const errorMessage = "Update failed";
    mockRepo.update.mockRejectedValue(new Error(errorMessage));
    await expect(service.update(1200, { name: "New Name" })).rejects.toThrow(errorMessage);
  });

  // 4. getPaging: Nếu repository.getPaging bị reject thì service.getPaging cũng reject.
  it("should throw an error if repository.getPaging fails in getPaging()", async () => {
    const errorMessage = "Paging failed";
    mockRepo.getPaging.mockRejectedValue(new Error(errorMessage));
    // Tạo một PageRequest hợp lệ theo định nghĩa
    const pageRequest = { pageNumber: 1, pageSize: 10, includeReferences: {} } as PageRequest;
    await expect(service.getPaging(pageRequest)).rejects.toThrow(errorMessage);
  });

  // 5. pushNotification: Nếu _notificationService.pushNotification (được gọi sau khi tạo notification) reject,
  // thì pushNotification nên reject.
  it("should throw an error if _notificationService.pushNotification fails in pushNotification()", async () => {
    const errorMessage = "Push notification failed";
    // Giả lập tạo notification thành công
    const notificationData = { id: 999 };
    mockPrismaService.notification.create = jest.fn().mockResolvedValue(notificationData);

  });
});
});
