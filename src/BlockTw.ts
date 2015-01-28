/**
 * 2Cars 障碍物动画队列
 * @author wangxu <ttian226@gmail.com>
 * @date 2015-01-27
 */

class BlockTw {

    private _twItems:Array<egret.Tween>;

    /**
     * 构造函数
     */
    public constructor() {
        this._twItems = [];
    }

    /**
     * 返回队列中动画个数
     * @return {number} [description]
     */
    public size():number {
        return this._twItems.length;
    }

    /**
     * 添加一个移动动画
     * @param {egret.Tween} tw [description]
     */
    public add(tw:egret.Tween):void {
        this._twItems.push(tw);
    }

    /**
     * 移除第一个移动动画
     */
    public remove():void {
        this._twItems.shift();
    }

    /**
     * 获取所有对象
     * @return {Array<egret.Tween>} [description]
     */
    public getAll():Array<egret.Tween> {
        return this._twItems;
    }

    /**
     * 清空队列
     */
    public clear():void {
        this._twItems = [];
    }
}


