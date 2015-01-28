/**
 * 2Cars 小车类
 * @author wangxu <ttian226@gmail.com>
 * @date 2015-01-27
 */


class Car {

    private _carContainer:egret.Sprite;         //汽车容器
    private _gameImgs:egret.SpriteSheet;        //集合位图game
    private _carData:egret.SpriteSheet;         //动画集合位图car
    private _carTexture:egret.Texture;          //汽车动画纹理集
    private _position:number;                   //汽车位置1：左侧 2：右侧
    private _carContainerTw:egret.Tween;        //小车容器缓动动画


    /**
     * 构造函数
     */
    public constructor() {
        //初始化汽车容器
        this._carContainer = new egret.Sprite();
        this._carContainer.y = 550;
        
        this._gameImgs = RES.getRes("game");
        this._carData = RES.getRes("carMc");
        this._carTexture = RES.getRes("carMcImg");
    }


    /**
     * 创建一个汽车容器
     * @param  {string}       type [红red 蓝blue]
     * @param  {number}       pos  [左侧1 右侧2]
     * @return {egret.Sprite}      [返回汽车容器对象]
     */
    public oneCar(type:string, pos:number):egret.Sprite {
        //添加汽车
        var car:egret.Bitmap = this.createCar(type);
        this._carContainer.addChild(car);
        //设置汽车相对位置
        if (pos == 1) {
            //左侧行驶
            this._carContainer.x = 32;
        } else if (pos == 2) {
            //右侧行驶
            this._carContainer.x = 152;
        }
        this._position = pos;

        //添加尾气
        var tail:egret.MovieClip = this.createTail(type);
        tail.x = 13;
        tail.y = 92;
        this._carContainer.addChild(tail);

        return this._carContainer;
    }

    /**
     * 取得当前汽车位置
     * @return {道路左侧1 道路右侧2}
     */
    public getCarPos():number {
        return this._position;
    }

    /**
     * 汽车左转
     */
    public turnLeft():void {
        this._carContainerTw = egret.Tween.get(this._carContainer);
        this._carContainerTw.to({x:32}, 300);
        this._position = 1;
    }

    /**
     * 汽车右转
     */
    public turnRight():void {
        this._carContainerTw = egret.Tween.get(this._carContainer);
        this._carContainerTw.to({x:152}, 300);
        this._position = 2;
    }

    /**
     * 创建汽车
     * @param  {string}       type [红red 蓝blue]
     * @return {egret.Bitmap}      [返回汽车对象]
     */
    private createCar(type:string):egret.Bitmap {
        var car:egret.Bitmap = new egret.Bitmap();
        if (type == 'red') {
            car.texture = this._gameImgs.getTexture("rcar");
        }

        if (type == 'blue') {
            car.texture = this._gameImgs.getTexture("bcar");
        }
        return car;
    }

    /**
     * 创建汽车尾气动画
     * @param  {红red 蓝blue}
     * @return {egret.MovieClip}
     */
    private createTail(type:string):egret.MovieClip {
        var carTailMc:egret.MovieClip = new egret.MovieClip(this._carData, this._carTexture);
        carTailMc.frameRate = 5;
        if (type == 'red') {
            carTailMc.gotoAndPlay('rq');
        }

        if (type == 'blue') {
            carTailMc.gotoAndPlay('bq');
        }
        return carTailMc;
    }

    /**
     * 创建汽车碰撞动画
     * @param  {红red 蓝blue}
     * @return {egret.MovieClip}
     */
    public carHit(type:string):egret.MovieClip {
        var carHitMc:egret.MovieClip = new egret.MovieClip(this._carData, this._carTexture);
        carHitMc.frameRate = 5;
        if (type == 'red') {
            carHitMc.gotoAndPlay('rz');
        }

        if (type == 'blue') {
            carHitMc.gotoAndPlay('bz');
        }
        return carHitMc;
    }

}


