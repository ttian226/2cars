/**
 * 2Cars
 * @author wangxu <ttian226@gmail.com>
 * @date 2015-01-27
 */

class Main extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;
    private _leftRoad:egret.Sprite;              //左侧道路容器
    private _rightRoad:egret.Sprite;             //右侧道路容器

    private _redmoves;
    private _bluemoves;

    private _list:BlockTw;                      //障碍物缓动动画队列

    private _rcar:Car;                          //红色小车实例
    private _bcar:Car;                          //蓝色小测实例

    private _gameoverContainer:egret.Sprite;    //游戏结束容器
    private _gameStartContainer:egret.Sprite;   //游戏开始容器
    private _gameHowtoContainer:egret.Sprite;   //游戏说明容器
    private _gamePauseContainer:egret.Sprite;   //游戏暂停容器

    private _gameImgs:egret.SpriteSheet;        //集合位图game
    private _score:number;                      //分数
    private _besetScore:number;                 //最高分数

    private _pauseBtn:egret.Bitmap;             //暂停按钮
    private _scoreShow:egret.TextField;         //游戏中显示的分数

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    /**
     * 创建游戏场景
     */
    private createGameScene():void{
        this._besetScore = 0;
        //创建背景图
        var sky:egret.Bitmap = this.createBitmapByName("bgImage");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        this._gameImgs = RES.getRes("game");

        //创建四条道路
        this.initRoads();
        //初始化两辆小车
        this.initTwoCars();
        //显示游戏开始页面
        this.showStartGame();
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    
    /**
     * 初始化道路
     */
    private initRoads():void {
        this._leftRoad = new egret.Sprite();
        this._leftRoad.width = (this.stage.stageWidth - 8) / 2;
        this._leftRoad.height = this.stage.stageHeight;

        this._rightRoad = new egret.Sprite();
        this._rightRoad.width = (this.stage.stageWidth - 8) / 2;
        this._rightRoad.height = this.stage.stageHeight;
        this._rightRoad.x = this.stage.stageWidth / 2 + 4

        this.addChild(this._leftRoad);
        this.addChild(this._rightRoad);
    }

    /**
     * 红色障碍物移动
     */
    private redBlockMove():void {
        if (this._score > 50) {
            //大于50分加速
            var rand = Math.floor(Math.random() * 600) + 1000;
        } else {
            var rand = Math.floor(Math.random() * 800) + 1000;
        }
        
        var $this = this;
        this._redmoves = setTimeout(function() {
                $this.creadRedBlock();
                $this.redBlockMove();  
        }, rand);
    }

    /**
     * 随机创建红色障碍物
     */
    private creadRedBlock():void {
        var type = Math.random() > 0.5 ? 1 : 0;
        var pos = Math.random() > 0.5 ? 1 : 2;

        var block = new Block();
        var oneblock:egret.Bitmap = block.oneBlock('red', type, pos);
        this._leftRoad.addChild(oneblock);

        var data = {
            color: 'red',
            type: type,
            pos: pos
        }
        oneblock['data'] = data;
        this.move(oneblock, type, this._leftRoad);
    }

    /**
     * 蓝色障碍物移动
     */
    private blueBlockMove():void {
        if (this._score > 50) {
            //大于50分加速
            var rand = Math.floor(Math.random() * 600) + 1000;
        } else {
            var rand = Math.floor(Math.random() * 800) + 1000;
        }
        var $this = this;
        this._bluemoves = setTimeout(function() {
                $this.creadBlueBlock();
                $this.blueBlockMove();  
        }, rand);
    }

    /**
     * 随机创建蓝色障碍物
     */
    private creadBlueBlock():void {
        var type = Math.random() > 0.5 ? 1 : 0;
        var pos = Math.random() > 0.5 ? 1 : 2;

        var block = new Block();
        var oneblock:egret.Bitmap = block.oneBlock('blue', type, pos);
        this._rightRoad.addChild(oneblock);

        var data = {
            color: 'blue',
            type: type,
            pos: pos
        }
        oneblock['data'] = data;
        this.move(oneblock, type, this._rightRoad);
    }

    /**
     * 设置障碍物移动
     * @param {egret.Bitmap} block [障碍物对象]
     * @param {number}       type  [类型1圆圈 2方块]
     * @param {egret.Sprite} road  [障碍物所在的道路容器]
     */
    private move(block:egret.Bitmap, type:number, road:egret.Sprite):void {
        var tw:egret.Tween = egret.Tween.get(block);
        if (type == 0) {
            //圆圈
            var endy = 748;
        } else if (type == 1) {
            //方块
            var endy = 800;
        }
        tw.to({y:endy}, 3000).call(this.moveToBottom, this, [road, block, type]);
        this._list.add(tw);
        var len = this._list.size();

        //对每个障碍物做侦听
        block.addEventListener(egret.Event.ENTER_FRAME,this.onMoveTo,this);
    }

    /**
     * 障碍物移动时监听事件
     * @param {egret.Event} evt [description]
     */
    private onMoveTo(evt:egret.Event):void {
        
        if(evt.target.y > 495) {   
            var binfo = evt.target['data'];

            //红色圆圈
            if (binfo.color == 'red' && binfo.type == 0) {
                //获取红色小车位置
                var pos = this._rcar.getCarPos();
                if (pos == binfo.pos) {
                    evt.target['status'] = 1;
                    console.log('小车吃掉红色圆圈+1分');
                    this._score++;
                    this._scoreShow.text = this._score + '';
                    this._leftRoad.removeChild(evt.target);
                }
            } 

            //红色方块
            if (binfo.color == 'red' && binfo.type == 1) {
                //获取红色小车位置
                var pos = this._rcar.getCarPos();
                if (pos == binfo.pos) {
                    console.log('小车撞到了红色方块');
                    this.stopGame();
                    this._leftRoad.removeChild(evt.target);
                    this.blockHit('red', pos, this._leftRoad);
                }
            } 

            //蓝色圆圈
            if (binfo.color == 'blue' && binfo.type == 0) {
                //获取蓝色小车位置
                var pos = this._bcar.getCarPos();
                if (pos == binfo.pos) {
                    evt.target['status'] = 1;
                    console.log('小车吃掉蓝色圆圈+1分');
                    this._score++;
                    this._scoreShow.text = this._score + '';
                    this._rightRoad.removeChild(evt.target);
                }
            }

            //蓝色方块
            if (binfo.color == 'blue' && binfo.type == 1) {
                //获取蓝色小车位置
                var pos = this._bcar.getCarPos();
                if (pos == binfo.pos) {
                    console.log('小车撞到了蓝色方块');
                    this.stopGame();
                    this._rightRoad.removeChild(evt.target);
                    this.blockHit('blue', pos, this._rightRoad);
                }
            } 
            
            //移除侦听
            evt.target.removeEventListener(egret.Event.ENTER_FRAME,this.onMoveTo,this);
        }

    }

    /**
     * 障碍物降落到底部的回调
     * @param {egret.Sprite} road  [障碍物所在的道路容器]
     * @param {egret.Bitmap} block [障碍物]
     * @param {number}       type  [1被小车撞过的圆圈]
     */
    private moveToBottom(road:egret.Sprite, block:egret.Bitmap, type:number):void {
        //缓动动画队列中删除第一个元素
        this._list.remove();
        if (type == 0) {

            if (block['status'] != 1) {
                //没有被小车撞到的圆圈到底部时，游戏结束
                this.stopGame();
                this.circleBlockToBottom(block);
            }
            
        } else {
            //移除对象
            road.removeChild(block);
        }
    }

    /**
     * 停止游戏
     */
    private stopGame():void {
        clearTimeout(this._redmoves);
        clearTimeout(this._bluemoves);
        var list:Array<egret.Tween> = this._list.getAll();
        for (var i=0; i<list.length; i++) {
            var tw:egret.Tween = list[i];
            tw.setPaused(true);
        }
    }


    /**
     * 初始化两辆小车
     */
    private initTwoCars():void {
        //红色小车
        this._rcar = new Car();
        var redCar = this._rcar.oneCar('red', 1);//左侧行驶
        //蓝色小车
        this._bcar = new Car();
        var blueCar = this._bcar.oneCar('blue', 2);//右侧行驶

        //在道路上添加小车
        this._leftRoad.addChild(redCar);
        this._rightRoad.addChild(blueCar);
    }


    /**
     * 左侧触摸事件
     */
    private touchLeftEvent():void {
        //获取当前汽车位置
        var pos = this._rcar.getCarPos();
        if (pos == 1) {
            this._rcar.turnRight();
        } else {
            this._rcar.turnLeft();
        }
    }

    /**
     * 右侧触摸事件
     */
    private touchRightEvent():void {
        //获取当前汽车位置
        var pos = this._bcar.getCarPos();
        if (pos == 1) {
            this._bcar.turnRight();
        } else {
            this._bcar.turnLeft();
        }
    }

    /**
     * 圆圈到底部动画
     * @param {egret.Bitmap} block [description]
     */
    private circleBlockToBottom(block:egret.Bitmap):void {
        var $this = this;
        setTimeout(function() {
            block.visible = false;
            setTimeout(function() {
                block.visible = true;
                setTimeout(function() {
                    block.visible = false;
                    setTimeout(function() {
                        block.visible = true;
                        $this.showGameOver();
                    }, 300);
                }, 300);
            }, 300);
        }, 300);
    }

    /**
     * 小车碰撞障碍物效果
     * @param {string}       color [红red 蓝blue]
     * @param {number}       pos   [左侧1 右侧2]
     * @param {egret.Sprite} road  [道路容器]
     */
    private blockHit(color:string, pos:number, road:egret.Sprite):void {
        var car = new Car();
        var hit:egret.MovieClip = car.carHit(color);
        if (pos == 1) {
            //左侧
            hit.x = 32 - 130;
            hit.y = 550 - 190;
        }

        if (pos == 2) {
            //右侧
            hit.x = 152 - 130;
            hit.y = 550 - 190;
        }
        road.addChild(hit);
        var $this = this;
        setTimeout(function() {
            road.removeChild(hit);
            $this.showGameOver();
        }, 800);
    }

    /**
     * 显示游戏开始页面
     */
    private showStartGame():void {

        //创建游戏开始容器
        this._gameStartContainer = new egret.Sprite();
        this.addChild(this._gameStartContainer);

        //添加遮罩
        var shade:egret.Bitmap = this.createBitmapByName("shadeImage");
        this._gameStartContainer.addChild(shade);

        //title
        var title:egret.Bitmap = new egret.Bitmap();
        title.texture = this._gameImgs.getTexture("title");
        title.x = 118;
        title.y = 150;
        this._gameStartContainer.addChild(title);

        //开始按钮
        var startBtn:egret.Bitmap = new egret.Bitmap();
        startBtn.texture = this._gameImgs.getTexture("start3");
        startBtn.x = 162;
        startBtn.y = 350;
        this._gameStartContainer.addChild(startBtn);

        startBtn.touchEnabled = true;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showHowto, this);
    }

    /**
     * 显示游戏说明页面
     */
    private showHowto():void {
        //移除游戏开始页面
        this.removeChild(this._gameStartContainer);

        //创建容器
        this._gameHowtoContainer = new egret.Sprite();
        this.addChild(this._gameHowtoContainer);

        //添加新手引导图
        var yindao:egret.Bitmap = this.createBitmapByName("ydImage");
        this._gameHowtoContainer.addChild(yindao);

        //主页按钮
        var homeBtn:egret.Bitmap = new egret.Bitmap();
        homeBtn.texture = this._gameImgs.getTexture("home2");
        homeBtn.x = 162;
        homeBtn.y = 600;
        this._gameHowtoContainer.addChild(homeBtn);
        homeBtn.touchEnabled = true;
        homeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.returnHome, this);
        
        //开始按钮
        var startBtn:egret.Bitmap = new egret.Bitmap();
        startBtn.texture = this._gameImgs.getTexture("start2");
        startBtn.x = 262;
        startBtn.y = 600;
        this._gameHowtoContainer.addChild(startBtn);
        startBtn.touchEnabled = true;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playGame, this);
    }

    /**
     * 返回到开始页面
     */
    private returnHome():void {
        //移除游戏开始页面
        this.removeChild(this._gameHowtoContainer);
        this.showStartGame();
    }


    /**
     * 开始游戏
     */
    private playGame():void {
        this._score = 0;
        //移除引导容器
        this.removeChild(this._gameHowtoContainer);
        //注册事件
        this._leftRoad.touchEnabled = true;
        this._leftRoad.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchLeftEvent, this);
        this._rightRoad.touchEnabled = true;
        this._rightRoad.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchRightEvent, this);

        //障碍物移动
        this._list = new BlockTw();
        this.redBlockMove();
        this.blueBlockMove();

        //暂停按钮
        this._pauseBtn = new egret.Bitmap();
        this._pauseBtn.texture = this._gameImgs.getTexture("pause");
        this._pauseBtn.x = 15;
        this._pauseBtn.y = 20;
        this.addChild(this._pauseBtn);
        this._pauseBtn.touchEnabled = true;
        this._pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pauseGame, this);

        this._scoreShow = new egret.TextField();
        this._scoreShow.text = this._score + '';
        this._scoreShow.x = 430;
        this._scoreShow.y = 20;
        this.addChild(this._scoreShow);
    }

    /**
     * 暂停游戏
     */
    private pauseGame():void {
        this.stopGame();
        //隐藏暂停按钮
        this.removeChild(this._pauseBtn);
        //创建游戏暂停容器
        this._gamePauseContainer = new egret.Sprite();
        this.addChild(this._gamePauseContainer);
        //添加遮罩
        var shade:egret.Bitmap = this.createBitmapByName("shadeImage");
        this._gamePauseContainer.addChild(shade);

        this._leftRoad.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchLeftEvent, this);
        this._rightRoad.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchRightEvent, this);

        //返回主页按钮
        var homeBtn:egret.Bitmap = new egret.Bitmap();
        homeBtn.texture = this._gameImgs.getTexture("home");
        homeBtn.x = 140;
        homeBtn.y = 300;
        this._gamePauseContainer.addChild(homeBtn);
        homeBtn.touchEnabled = true;
        homeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goHome, this);
        
        //继续游戏按钮
        var continueBtn:egret.Bitmap = new egret.Bitmap();
        continueBtn.texture = this._gameImgs.getTexture("start");
        continueBtn.x = 260;
        continueBtn.y = 300;
        this._gamePauseContainer.addChild(continueBtn);
        continueBtn.touchEnabled = true;
        continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resumeGame, this);
    }

    /**
     * 恢复游戏
     */
    private resumeGame():void {
        //显示暂停按钮
        this.addChild(this._pauseBtn);
        //注册事件
        this._leftRoad.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchLeftEvent, this);
        this._rightRoad.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchRightEvent, this);

        this.removeChild(this._gamePauseContainer);
        this.redBlockMove();
        this.blueBlockMove();
        var list:Array<egret.Tween> = this._list.getAll();
        for (var i=0; i<list.length; i++) {
            var tw:egret.Tween = list[i];
            tw.setPaused(false);
        }
    }

    /**
     * 显示游戏结束页面
     */
    private showGameOver():void {
        console.log('得分:' + this._score);
        this._besetScore = (this._score > this._besetScore) ? this._score : this._besetScore;
        console.log('最高得分:' + this._besetScore);
        //隐藏暂停按钮
        this.removeChild(this._pauseBtn);

        //创建结束容器
        this._gameoverContainer = new egret.Sprite();
        this.addChild(this._gameoverContainer);

        this._leftRoad.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchLeftEvent, this);
        this._rightRoad.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchRightEvent, this);

        //添加遮罩
        var shade:egret.Bitmap = this.createBitmapByName("shadeImage");
        this._gameoverContainer.addChild(shade);

        //完了
        var wanle:egret.Bitmap = new egret.Bitmap();
        wanle.texture = this._gameImgs.getTexture("over");
        wanle.x = 160;
        wanle.y = 100;
        this._gameoverContainer.addChild(wanle);

        //重玩按钮
        var replayBtn:egret.Bitmap = new egret.Bitmap();
        replayBtn.texture = this._gameImgs.getTexture("restart");
        replayBtn.x = 180;
        replayBtn.y = 380;
        this._gameoverContainer.addChild(replayBtn);
        replayBtn.touchEnabled = true;
        replayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartGame, this);

        //炫耀按钮
        var shareBtn:egret.Bitmap = new egret.Bitmap();
        shareBtn.texture = this._gameImgs.getTexture("share");
        shareBtn.x = 180;
        shareBtn.y = 550;
        this._gameoverContainer.addChild(shareBtn);
        shareBtn.touchEnabled = true;
        shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);

        //更多游戏
        var moreBtn:egret.Bitmap = new egret.Bitmap();
        moreBtn.texture = this._gameImgs.getTexture("more");
        moreBtn.x = 180;
        moreBtn.y = 620;
        this._gameoverContainer.addChild(moreBtn);
        moreBtn.touchEnabled = true;
        moreBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moreGame, this);

        //分数
        var score:egret.Bitmap = new egret.Bitmap();
        score.texture = this._gameImgs.getTexture("score");
        score.x = 130;
        score.y = 230;
        this._gameoverContainer.addChild(score);

        //最高分数
        var bestScore:egret.Bitmap = new egret.Bitmap();
        bestScore.texture = this._gameImgs.getTexture("bestscore");
        bestScore.x = 130;
        bestScore.y = 300;
        this._gameoverContainer.addChild(bestScore);

        //分数，数字
        var score_number:egret.TextField = new egret.TextField();
        score_number.text = this._score + '';
        score_number.x = 280;
        score_number.y = 235;
        this._gameoverContainer.addChild(score_number);

        //最高分数，数字
        var bestscore_number:egret.TextField = new egret.TextField();
        bestscore_number.text = this._besetScore + '';
        bestscore_number.x = 280;
        bestscore_number.y = 305;
        this._gameoverContainer.addChild(bestscore_number);
    }

    /**
     * 重新开始游戏
     */
    private restartGame():void {
        this._score = 0;
        this._scoreShow.text = this._score + '';
        //移除结束容器
        this.removeChild(this._gameoverContainer);
        //移除所有障碍物
        this._leftRoad.removeChildren();
        this._rightRoad.removeChildren();

        this.initTwoCars();

        this.addChild(this._pauseBtn);

        this._list.clear();
        this.redBlockMove();
        this.blueBlockMove();

        //注册事件
        this._leftRoad.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchLeftEvent, this);
        this._rightRoad.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchRightEvent, this);
    }

    /**
     * 暂停页面返回主页
     */
    private goHome():void {
        //移除暂停容器
        this.removeChild(this._gamePauseContainer);
        //移除所有障碍物
        this._leftRoad.removeChildren();
        this._rightRoad.removeChildren();
        this.initTwoCars();

        this._list.clear();

        this.showStartGame();

        this.removeChild(this._scoreShow);
    }

    /**
     * 微信分享游戏
     */
    private shareGame():void {
        
    }

    /**
     * 更多游戏
     */
    private moreGame():void {
    
    }


}


