/**
 * 2Cars 障碍物类
 * @author wangxu <ttian226@gmail.com>
 * @date 2015-01-27
 */

class Block {

    private _gameImgs:egret.SpriteSheet;        //集合位图game
    private _block:egret.Bitmap;                //障碍物对象


    /**
     * 构造函数
     */
    public constructor() {
        this._gameImgs = RES.getRes("game");
        this._block = new egret.Bitmap();
        this._block.y = -52;    //y轴起始点
    }

    /**
     * 生成一个障碍物对象
     * @param  {string}       color [红red 蓝blue]
     * @param  {number}       type  [圆形0 方块1]
     * @param  {number}       pos   [障碍物相对位置1:路左侧 2路右侧]
     * @return {egret.Bitmap}       [返回障碍物对象]
     */
    public oneBlock(color:string, type:number, pos:number):egret.Bitmap {

        //设置障碍物类型
        if (type == 0) {
            //圆圈
            if (color == 'red') {
                this._block.texture = this._gameImgs.getTexture("rpoint1");
            } else if (color == 'blue') {
                this._block.texture = this._gameImgs.getTexture("bpoint1");
            }
        } else if (type == 1) {
            //方块
            if (color == 'red') {
                this._block.texture = this._gameImgs.getTexture("rpoint2");
            } else if (color == 'blue') {
                this._block.texture = this._gameImgs.getTexture("bpoint2");
            }
        }

        //设置障碍物相对位置
        if (pos == 1) {
            //左侧
            this._block.x = 32;
        } else if (pos == 2) {
            //右侧
            this._block.x = 152;
        }
        return this._block;
    }
}


