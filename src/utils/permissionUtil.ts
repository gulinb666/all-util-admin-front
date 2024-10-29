class PermissionUtil {

  /**
   * 二进制权限 默认全部权限都没有
   * 0b0001或1代表有可查询的权限
   * 0b0010或2代表有新增的权限
   * 0b0100或4代表有修改的权限
   * 0b1000或8代表有删除的权限
   * PS: 如果还有新的权限可在此新增，例如：把0b0001改成0b00001，就是又新增了一个权限，不再是增删改查了，而是增删改查自定义权限
   */
  private _permission: number = 0b0000;

  constructor(permission: number) {
    this._permission = permission;
  }

  public setPermission(permission: number): void {
    this._permission = permission;
  }

  /**
   * 查询是否有查看权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isSelect(): boolean | Boolean {
    return (this._permission & 1) !== 0;
  }

  /**
   * 查询是否有新增权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isInsert(): boolean | Boolean {
    return (this._permission & 2) !== 0;
  }

  /**
   * 查询是否有修改权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isUpdate(): boolean | Boolean {
    return (this._permission & 4) !== 0;
  }

  /**
   * 查询是否有删除权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isDelete(): boolean | Boolean {
    return (this._permission & 8) !== 0;
  }

  /**
   * 查询是否有新增及修改权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isInsertAndUpdate(): boolean | Boolean {
    return this.isInsert() && this.isUpdate();
  }

  /**
   * 查询是否有新增及查看权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isInsertAndSelect(): boolean | Boolean {
    return this.isInsert() && this.isSelect();
  }

  /**
   * 查询是否有新增及删除权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isInsertAndDelete(): boolean | Boolean {
    return this.isInsert() && this.isDelete();
  }

  /**
   * 查询是否有修改及查看权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isUpdateAndSelect(): boolean | Boolean {
    return this.isUpdate() && this.isSelect();
  }

  /**
   * 查询是否有修改及删除权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isUpdateAndDelete(): boolean | Boolean {
    return this.isUpdate() && this.isDelete();
  }

  /**
   * 查询是否有查看及删除权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isSelectAndDelete(): boolean | Boolean {
    return this.isSelect() && this.isDelete();
  }

  /**
   * 查询是否有新增及修改和查看权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isInsertAndUpdateAndSelect(): boolean | Boolean {
    return this.isInsertAndUpdate() && this.isSelect();
  }

  /**
   * 查询是否有新增及修改和删除权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isInsertAndUpdateAndDelete(): boolean | Boolean {
    return this.isInsertAndUpdate() && this.isDelete();
  }

  /**
   * 查询是否有新增及查看和删除权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isInsertAndSelectAndDelete(): boolean | Boolean {
    return this.isInsertAndSelect() && this.isDelete();
  }

  /**
   * 查询是否有修改及查看和删除权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isUpdateAndSelectAndDelete(): boolean | Boolean {
    return this.isUpdateAndSelect() && this.isDelete();
  }

  /**
   * 查询是否有全部权限
   * @return boolean | Boolean 如果有权限返回true 否则返回false
   */
  public isAllPermission(): boolean | Boolean {
    return this.isInsertAndUpdateAndSelect() && this.isDelete();
  }

}

export default PermissionUtil;
