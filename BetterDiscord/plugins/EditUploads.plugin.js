//META{"name":"EditUploads"}*//

// !!! Hey there! If you didn't come here from the BetterDiscord Discord server ( https://discord.gg/2HScm8j )  !!! //
// !!! then please do not use whatever you were using that led you here, getting plugins from places other than !!! //
// !!! the #plugin repo channel in the BD server can be dangerous, as they can be malicious and do bad things.  !!! //

class EditUploads {
    constructor() {
        // vv Stole this function from Zere's Plugin Library vv //
        this.getReactInstance = function (node) {
            if (!(node instanceof jQuery) && !(node instanceof Element))
                return undefined;
            var domNode = node instanceof jQuery ? node[0] : node;
            return domNode[Object.keys(domNode).find((key) => key.startsWith("__reactInternalInstance"))];
        };
        // ^^ Stole this function from Zere's Plugin Library ^^ //
    }
    getName() {
        return "Edit Uploads";
    }
    getDescription() {
        return "Edit image files before uploading.  Uses icons from icons8 https://icons8.com/";
    }
    getVersion() {
        return "0.0.3";
    }
    getAuthor() {
        return "Qwerasd";
    }
    load() {
        this.uploadModalClass = BdApi.findModuleByProps('uploadModal').uploadModal;
        this.descriptionClass = BdApi.findModuleByProps('file', 'filename', 'comment', 'description').description;
        this.iconClass = BdApi.findModuleByProps('file', 'filename', 'comment', 'description').icon;
        this.icons = {
            rectangle: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABZSURBVFiF7ZYxCoBAEAMT8f8/EkH8V2xOOBThmlssZtotMtkqEkAjyZ46tjvXnUAqC9u2JK1fh1k8iy4zw0ZAAAEEEEAAAQQQeC2i6mnWf+AszD0KswB+zgV/VXy+7ejmKwAAAABJRU5ErkJggg==',
            crop: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFkSURBVFiF5ZY/TsMwGMXfBz0CQlyChQkWWOAIWSs6IFDDnx2JkyBK587cgQNwBBhgQoxItD+GuhCKGzuNEwnxpCiJ/OX9nmNbtvTfBKzHFO0AGZAlhveBN2A7VDjCKSE8BybO9hVYay0AcMm3xkBv1tYpFO1KunKvmx6TYnsVdSTtzWwk5WZ260uZ4VGovYLGwOE8d2WJHi2rOzMbRlXWnQNAF/iY+wMjX23yPwB0JQ0krWo65qVKGgDIJQ0dfCKpV/pBiVHlIeDnOv+acKEhSBIAOPXBWwlQBm88QAjeaADgLARvLIAHvnC2Jw8AnMfCkweoCk8aALioCk8WYFl4kgDAcQE+AfrRRlOvfXf9OmPEBijC8yrwGHXCJTJNN5YjMxukDrBoN3z21N2QTlnR2KdrSe8JOhiUdwjM7AHYknQiaaMmY9bbJ0n37vmxpme8QsuwzUOpVzGroK4O3P2lBdYf1CeOTDUFiQFoXAAAAABJRU5ErkJggg==',
            blur: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIQSURBVFiF1ZZPS1RhFMbPa1CtZjJpldIfA2nATRAhbRoNW7gI+gIFQgulIj+EG6EwCsrWkoIDgiD0BVoURGnFlCuFFKKVocxUzs+FL8xT3hv3vXdmpAMXzr3vec7znPP+ua/Z/2xAJ3DyoMjbgU/AR+BYq8kPAYvUbQFoa6WAJ+y38VaR3xLS7/4B2AGGmk1+Aah4wipwGSgCv/y3H0ChWeR5YEWqvy9jY/K9DOSaIWBKSOYAJ2MOKMn400aTDwI1n3w1qkLfoTUfUwOuNor8OLAuia/8I7YoQr8C7Y0Q8EBa+yxB/HOJn8hK3u1Xe2zrIzA5mYoKcCaLgHmp5noA7obgSmnJCzKfr3TVJ8A64LWsm540Ah5JFYMp8EOCfxgKPkL9iC2HVC852oAvPsc34HBUXNwfbMDMOrw/45wjVIBzrmZms/71hJkVQwT0ib8YSh6D7YsKiBPQJf7nDALK4p8KEaAt/51BgGIjpzFOwIb4XTExSUyx6yECPojfn0HAgPjLiVHsXTh/+i30JsM2fOtzVIF8aIIZOUhuphAwLPjpULwB56QLW8DFAOwlYDvzDwm4J1Vs+apir9++7beFHGA0Fbkkfcyf9g64C5wHjvqn4MW+/yt2MhO5iLhD/V6QxCrASEPIRcRZ4IWsiyirAtPA6aR502yvvJldM7Neqx+vq2a2ZGYvnXOboTkP1HYBffUf8YXFeiQAAAAASUVORK5CYII=',
            inverseBlur: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAF9SURBVFiF1ZW7SgNBGEa/UbCwMEaxMuIFRRBs7Ky0E7HxDbQMgq9hIwiCgtiLlRcQBF9DiAhWgkkhWHgpNoo5FnFJNDtLdmc24tf+8J2zw8780n8OUACG/wqeB26AEtDfaXg3cEkjF0BXJwX2ac1Wp+DrEXCAT2Ala/gcEFgEAF6BmazgOeAuBh7mFujLQuCwDXiYA9/w1QTwMMu+4ANAJYVAGcj7ENhJAQ+z7QqfAT4cBN6BKReBcwd4mBOXr695EKgB0zZO3PtdlGRS2f+M+e6yDlsC9EoqS/K15Z4kFYwxwe+B7QQWPcIlaVDSQtTAJjDvER7baRMYyUBgNIkAGQhEdtoEKhkIPCQRKGUgENlpu4Y5SY+SejzBA0lDxpi334PIEzDGPEs68wSXpNMoeGyASerLxDUBMJ5KGyh6EFhLBW+S2HOA7zrBmyQ2gWoCcABseIE3SUwAx8T/F1XgCBhrtzfxuqV+RZckzarxvN5LupZ0ZYx5Sdr5p/kC40fFCUHhtX0AAAAASUVORK5CYII=',
            brush: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHUSURBVFiF7dbPi01xGMfxc5oZk8IQm8m9GKMuhkgWdlIsZmEtu/FvGOyt/AkkTUhTQmYh2VKUUhKiMcbPMaaslPuymOfkdOfeaPqeyeJ+6nROz+f0vJ/nfH+dLOuqqwqEEVzHm7iuYddKwQ/hu6Wax86q4QcDBDdQQx23I3a1Svh+zBUg9JS8zRF/XxV8L76UOu9t8WvhvasCvhufAnATfS1+TxQFE6nhDXyI5HfQ3+L3xQooJuH2lPCRv3S+GnfD/4x9KeFDmC4tsYtYU/L7cSu8rziQEr7F4uYC3/Arnh9jbXQ+VVXnNbyK5I8wEPPgecQu4V48f8SelPBBvIjkT7Ch5DVKXwJmpdp6MRrLqNhemxhreWddDAfMoJEKflZnnYt31uNhxKaxIxX8aHT7E+PYFteZiDVxMiYfvMVQEngU8CASn2/jjbd8jdfYmhI+HInnMdDGHyzBX6K+XFZvh/iJuE/meb7Qxm/GfSHLssN5ns8ut4C2wtPo7lgHvxiCyaTgSF6P5HOWHqubcCEmIYxWUcBYuTuswnFM4Ed4TZxODg/glYBMWdyAil+sQvdxpCp47s/5XtazGPfhSsClAorlN4PLOJV0ff9DARtXFNjV/6Df96UwpUt/UBgAAAAASUVORK5CYII=',
            undo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHESURBVFiF7daxaxRREMfxWSPBSrAIKCpqQIIiWPg/WBgVEbUVLAQbU8Q/w1YEQTAgiFhExcJGggn4B1iIEEknCFoYYxHDxY/FTchx3mXv9vaSQn+wDOzsm/my896biagojOBu1fUDCWOYh51IfgKLUtudfBLLWrSdyW/gl7/1FR/wGrewf1gA02h0AGjXGu7j4DAgJvGjLeE+jOMyHmM136/g0jAgTmGp2x7AUTxL9zqmqiaaw5suvtJjiKks2TrOVwFYwNst/KN4WBLjdv6J7zjQN0QdwtOEeLBTAOOax7eBw+3+XR0WdK19FRVFsRQRLyJiJCIulgJExO586tTztOdqjtubMJH74ONOAexNgOV2X6c98A7zdTOkLcq/5FvS1naXb1WCTpvwfdrTdQFExJm0n3oBWEh7pUaAjab0qvRLHMv7ewVjg2bG8WzRaz1fx5jNms0MmLzAy4x1r5+FR/ATv3FzAIDplmbU36SE6wnQqAIxcDvOIHds6hEO9bCmnoGkJeBVm2PYqubYdS3LNIo9OJl/7IlhjGR5MmYMYSgtvxrbQCLiQkScjYiJiNjo758jYjGabXe2KIov/cT9r39bfwAudYMcsxLSggAAAABJRU5ErkJggg==',
            redo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHcSURBVFiF7da7ahVhFAXgfYwGG4uACDEJkRALtRGfwUabGBVsRNDKCwh5AN/AB9BCBSUIIipoE0REg72VRSQgtgEhXtAYPZ9F9oFjcpKZYSYK4mo2zL/2Xuu/zf4jagJX0Ve3Th0D8BQDf9MAvMW+v2kAPuDwZooN4iJm8AYL1mIJ58rW3FpSeDgirkTE2YjYVkDvi4jmzgOO43PO7ivuYBJjGFg1+0UcbVJ8Cu0sfg+jPTgdzONAk+IT+IllXN6ABy+xc53x53hWVXwIH7P4pQLuDfRvMD6LF1UN3Ezx6UqJTQCj+IFv2LPZelt6fJuIlav0sNVqvWtKaL2z0Os/cCTjo6bEu7TahSzM5f6PN2ygHLpO/44/odfrDLQyFi9XBeR1fFWG2NmCvQ2Kj2TNhdVjvVZgPuOhpgxExMGMr8sYeJLxWIMGTmacLWTmb3g5+/pYXWXswpfsK2ua2XpJ13LPHjRgYDpr3a+StLvrOk7VEL+QNT5hpGpyqXa8Qf757CltnK6a3ylS+CDpkTOC25nTrrOCnYKrn2R3cQb7sR392UFP5X4vJXcRJ2qJd5kYxnV8V4xl3FKylbeKKb8ZGYyIyVhp2eMRMZRD7yNiLiJmIuJxk238P/59/ALb21MuiNBdkwAAAABJRU5ErkJggg==',
            check: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFMSURBVFiF7ZW/TsJQFIe/gw4+iJuWDsBr+ArGQOL/mMsiGHddpA4ii0ZHQxwdfAcvg+V9ehxaYgNFaSkdtL+tuaf3++7J6S2UKVPmv0eKgLgf7X0VvQFe/LrXiq+trxpeteZI0TvCw+5Mr1dWDQcmcEXpFibgWtMB+hE8UKHpN7zH6bqVzIBrTUfhKnoMVGiNa95TUm3uAmnguQukhecqkAWem0BW+FyBrZHZXFMuUX3zG7evP21Qte1D0Mm0K8ixX+8NFpVP/AwrARfALiLDEJAc15qDZeDzBSq8hxsioP0QNAtXuF8GPlfgs+YNVWgCASAKA8e2z2PwjsKA+CWTAQ6/DKEzMnuiPESiChhFNgS9jkpSDVxqAUi4z7/fy9z2VAIw0wmAQEWa41rveRk4LPgzilp8StgBBTnJA54626OzqmONUzi4TJk/nS/UUpvIjjxSkwAAAABJRU5ErkJggg==',
            eraser: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGcSURBVFiF7ZbLLgNxFMZP7SppVy6phAg7vIDnUCxq0YVWIkqUuBPPw6J7JUTUA9CEBYKQ1EK6d/tZOE3+RnUunZlVTzKbM+f7ft/MnJmMSKt8KGAcuAQqwD7QEyZ8h79VAYbCgC8r8APIAr3AqfYegcEg4bUrfwOSRj8KFI07MRwa3BLiUGdegJGg4GMN5tqBI19DAEvGM085mI8BJdU8A32hwQ1dHDhXbaFZOEDOg75btdVm4QBXQMKlR0a1ZbfwvAo/gVWFuwoBpFVPvTemkXBbRe/ApPY6gQvt3wP9Nh5zwJceGa/wCcs5RyEs8KwvcKchgFxgcLsQFviCG3jSWLi0Q03CWMxrYMVYuDXHcDUrq3Dapc4MUat1V3A1qqq4w4N23oBvuIarSUENDoCoC12Kn88zwKYnuBr1AU9qVHQSApgy4Fue4ZYQt2p4BsQazM7qpgMsNg3/J0QJiNvA877BLSFu6oUIHG6ABoAHBZ0AXcCM8Z7v+sGJ2IUQkWMR8f4nYwVGIr+YbTbDdyIyKiJ7IvLqV4hWtcqsb8bJP3WiOIYMAAAAAElFTkSuQmCC',
            save: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB+gAAAfoBF4pEbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAD7SURBVFiF7ZdNbsJADEadwjE4UdmgnACJImVTfs4LQShtbkHzunGkgIIZTwIUNd9mIsf+/DSZjGZEBqmABNgCO+BEN/0ACy/AqmPTNogPD8BeC1NgVLsY+WdqiVcuCC0ASJpGHQCyBsQyBKDVKBZAn+cKUAHrhwO4ILwAoT4ayzRcPQXAio8Nr28RmcRAiMhXaOKb8S4TkTKieam1PsVOeVd/awYeogFgALgJAEyBw+XWaygH3t0kxg5WOJrXOob6hwC49gevz99fA/8KoD7FJH03aXiaa+Cg46xvABFJdcyvZtD/sbxNnxZAfTGJ+e9vqQA23OHzDnp9/QK8BlZMPbVohgAAAABJRU5ErkJggg=='
        };
        this.tools = [
            {
                name: 'rectangle',
                icon: this.icons.rectangle,
                settings: {
                    thickness: { type: 'range', min: 2, max: 30, default: 10 },
                    color: { type: 'color', value: '#ff0000' }
                },
                initialize: function () {
                    this.imageCopy = document.createElement('canvas');
                    this.imageCopyCtx = this.imageCopy.getContext('2d');
                },
                selected: async function (canvas, ctx, helpers) {
                    ctx.lineWidth = Math.max(1, this.settings.thickness.value * (canvas.width / parseInt(canvas.style.width)));
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.strokeStyle = this.settings.color.value;
                    this.imageCopy.width = canvas.width;
                    this.imageCopy.height = canvas.height;
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                },
                mouseDown: function (_, __, location) {
                    this.startLoc = location;
                },
                mouseMove: function (_, ctx, location) {
                    ctx.drawImage(this.imageCopy, 0, 0);
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    ctx.strokeRect(x, y, w, h);
                },
                mouseUp: function (canvas, ctx, location) {
                    ctx.drawImage(this.imageCopy, 0, 0);
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    ctx.strokeRect(x, y, w, h);
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                }
            },
            {
                name: 'draw',
                icon: this.icons.brush,
                settings: {
                    size: { type: 'range', min: 2, max: 150, default: 10 },
                    color: { type: 'color', value: '#ff0000' }
                },
                initialize: () => { },
                selected: function (canvas, ctx) {
                    ctx.strokeStyle = this.settings.color.value;
                    ctx.lineWidth = Math.max(1, this.settings.size.value * (canvas.width / parseInt(canvas.style.width)));
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                },
                mouseDown: function (_, ctx, location) {
                    ctx.beginPath();
                    ctx.moveTo(location.x, location.y);
                },
                mouseMove: function (_, ctx, location) {
                    ctx.lineTo(location.x, location.y);
                    ctx.stroke();
                },
                mouseUp: function (_, ctx, location) {
                    ctx.lineTo(location.x, location.y);
                    ctx.stroke();
                }
            },
            {
                name: 'erase',
                icon: this.icons.eraser,
                settings: {
                    size: { type: 'range', min: 2, max: 150, default: 20 },
                },
                initialize: function (canvas) {
                    this.imageCopy = document.createElement('canvas');
                    this.imageCopy.width = canvas.width;
                    this.imageCopy.height = canvas.height;
                    this.imageCopyCtx = this.imageCopy.getContext('2d');
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                    this.scratch = document.createElement('canvas');
                    this.scratchCtx = this.scratch.getContext('2d');
                    this.crop = [0, 0, canvas.width, canvas.height];
                },
                selected: function (canvas) {
                    this.scratch.width = canvas.width;
                    this.scratch.height = canvas.height;
                    this.scratchCtx.lineWidth = this.settings.size.value * (canvas.width / parseInt(canvas.style.width));
                    this.scratchCtx.lineJoin = "round";
                    this.scratchCtx.lineCap = "round";
                    this.scratchCtx.strokeStyle = 'white';
                    this.scratchCtx.clearRect(0, 0, this.scratch.width, this.scratch.height);
                },
                mouseDown: function (_, ctx, location) {
                    this.scratchCtx.beginPath();
                    this.scratchCtx.moveTo(location.x, location.y);
                    this.scratchCtx.globalCompositeOperation = 'source-in';
                    this.scratchCtx.drawImage(this.imageCopy, ...this.crop, 0, 0, this.scratch.width, this.scratch.height);
                    this.scratchCtx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.scratch, 0, 0);
                },
                mouseMove: function (_, ctx, location) {
                    this.scratchCtx.lineTo(location.x, location.y);
                    this.scratchCtx.stroke();
                    this.scratchCtx.globalCompositeOperation = 'source-in';
                    this.scratchCtx.drawImage(this.imageCopy, ...this.crop, 0, 0, this.scratch.width, this.scratch.height);
                    this.scratchCtx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.scratch, 0, 0);
                },
                mouseUp: function (_, ctx, location) {
                    this.scratchCtx.lineTo(location.x, location.y);
                    this.scratchCtx.stroke();
                    const data = this.scratchCtx.getImageData(0, 0, this.scratch.width, this.scratch.height).data;
                    for (var i = 3; i < data.length; i += 4) {
                        if (data[i] < 255)
                            data[i] = 0;
                    }
                    this.scratchCtx.putImageData(new ImageData(data, this.scratch.width), 0, 0);
                    this.scratchCtx.globalCompositeOperation = 'source-in';
                    this.scratchCtx.drawImage(this.imageCopy, ...this.crop, 0, 0, this.scratch.width, this.scratch.height);
                    this.scratchCtx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.scratch, 0, 0);
                }
            },
            {
                name: 'blur',
                icon: this.icons.blur,
                settings: {
                    amount: { type: 'range', min: 1, max: 9, default: 3 },
                },
                initialize: function () {
                    this.imageCopy = document.createElement('canvas');
                    this.imageCopyCtx = this.imageCopy.getContext('2d');
                    this.blurred = document.createElement('canvas');
                    this.blurredCtx = this.blurred.getContext('2d');
                },
                selected: async function (canvas, ctx, helpers) {
                    ctx.lineWidth = Math.max(1, 2 * (canvas.width / parseInt(canvas.style.width)));
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.strokeStyle = 'white';
                    this.imageCopy.width = canvas.width;
                    this.imageCopy.height = canvas.height;
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                    const blurredCanvas = await helpers.blurImage(canvas, this.settings.amount.value);
                    this.blurred.width = canvas.width;
                    this.blurred.height = canvas.height;
                    this.blurredCtx.putImageData(blurredCanvas, 0, 0, 0, 0, canvas.width, canvas.height);
                },
                mouseDown: function (_, __, location) {
                    this.startLoc = location;
                },
                mouseMove: function (_, ctx, location) {
                    ctx.drawImage(this.imageCopy, 0, 0);
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    ctx.drawImage(this.blurred, x, y, w, h, x, y, w, h);
                    ctx.strokeRect(x, y, w, h);
                },
                mouseUp: function (canvas, ctx, location) {
                    ctx.drawImage(this.imageCopy, 0, 0);
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    ctx.drawImage(this.blurred, x, y, w, h, x, y, w, h);
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                }
            },
            {
                name: 'inverse blur',
                icon: this.icons.inverseBlur,
                settings: {
                    amount: { type: 'range', min: 1, max: 9, default: 3 },
                },
                initialize: function () {
                    this.imageCopy = document.createElement('canvas');
                    this.imageCopyCtx = this.imageCopy.getContext('2d');
                    this.blurred = document.createElement('canvas');
                    this.blurredCtx = this.blurred.getContext('2d');
                },
                selected: async function (canvas, ctx, helpers) {
                    ctx.lineWidth = Math.max(1, 4 * (canvas.width / parseInt(canvas.style.width)));
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.strokeStyle = 'white';
                    this.imageCopy.width = canvas.width;
                    this.imageCopy.height = canvas.height;
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                    const blurredCanvas = await helpers.blurImage(canvas, this.settings.amount.value);
                    this.blurred.width = canvas.width;
                    this.blurred.height = canvas.height;
                    this.blurredCtx.putImageData(blurredCanvas, 0, 0, 0, 0, canvas.width, canvas.height);
                },
                mouseDown: function (_, __, location) {
                    this.startLoc = location;
                },
                mouseMove: function (_, ctx, location) {
                    ctx.drawImage(this.blurred, 0, 0);
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    ctx.drawImage(this.imageCopy, x, y, w, h, x, y, w, h);
                    ctx.strokeRect(x, y, w, h);
                },
                mouseUp: function (canvas, ctx, location) {
                    ctx.drawImage(this.blurred, 0, 0);
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    ctx.drawImage(this.imageCopy, x, y, w, h, x, y, w, h);
                    this.blurredCtx.drawImage(canvas, 0, 0);
                }
            },
            {
                name: 'crop',
                icon: this.icons.crop,
                settings: {},
                initialize: function (_, __, tools) {
                    this.imageCopy = document.createElement('canvas');
                    this.imageCopyCtx = this.imageCopy.getContext('2d');
                    this.greyed = document.createElement('canvas');
                    this.greyedCtx = this.greyed.getContext('2d');
                    this.eraser = tools.find(t => t.name === 'erase');
                },
                selected: async function (canvas, ctx) {
                    ctx.lineWidth = Math.max(1, 4 * (canvas.width / parseInt(canvas.style.width)));
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.strokeStyle = 'white';
                    this.imageCopy.width = canvas.width;
                    this.imageCopy.height = canvas.height;
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                    this.greyed.width = canvas.width;
                    this.greyed.height = canvas.height;
                    this.greyedCtx.drawImage(canvas, 0, 0);
                    this.greyedCtx.globalAlpha = 0.6;
                    this.greyedCtx.fillRect(0, 0, canvas.width, canvas.height);
                    this.greyedCtx.globalAlpha = 1;
                },
                mouseDown: function (_, __, location) {
                    this.startLoc = location;
                },
                mouseMove: function (_, ctx, location) {
                    ctx.drawImage(this.greyed, 0, 0);
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    ctx.drawImage(this.imageCopy, x, y, w, h, x, y, w, h);
                    ctx.strokeRect(x, y, w, h);
                },
                mouseUp: function (canvas, ctx, location, helpers) {
                    const [x, y, w, h] = [this.startLoc.x, this.startLoc.y, location.x - this.startLoc.x, location.y - this.startLoc.y];
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(this.imageCopy, x, y, w, h, 0, 0, w, h);
                    this.imageCopy.width = w;
                    this.imageCopy.height = h;
                    this.imageCopyCtx.drawImage(canvas, 0, 0);
                    this.eraser.crop = [x, y, w, h];
                    helpers.fitCanvas(canvas, canvas.parentNode);
                }
            }
        ];
        this.restoreToolDefaults();
        this.mouseCurrentlyDown = false;
        this.toolHelpers = {
            getDPI: async function () {
                return new Promise(resolve => {
                    const div = document.createElement('div');
                    div.style.width = '1in';
                    div.style.height = '0';
                    document.body.appendChild(div);
                    const dpi = div.offsetWidth * window.devicePixelRatio;
                    div.remove();
                    require('electron').remote.getCurrentWindow().webContents.getZoomFactor(f => {
                        resolve(dpi / f);
                    });
                });
            },
            blurImage: async function (image, amount) {
                const { width, height } = image;
                const scaleFactor = await this.getDPI();
                const dpiFactor = scaleFactor / 96;
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height, 0, 0, width / dpiFactor, height / dpiFactor);
                ctx.filter = `blur(${amount}px)`;
                ctx.drawImage(image, 0, 0, width, height, 0, 0, width / dpiFactor, height / dpiFactor);
                ctx.filter = '';
                ctx.drawImage(canvas, 0, 0, width / dpiFactor, height / dpiFactor, 0, 0, width, height);
                return ctx.getImageData(0, 0, width, height);
            },
            fitCanvas: function (canvas, wrapper) {
                const { width, height } = wrapper.getBoundingClientRect();
                const canvasAspectRatio = canvas.width / canvas.height;
                const wrapperAspectRatio = width / height;
                wrapperAspectRatio >= canvasAspectRatio ?
                    (canvas.style.height = height + 'px') && (canvas.style.width = (height * canvasAspectRatio) + 'px')
                    : (canvas.style.width = width + 'px') && (canvas.style.height = (width / canvasAspectRatio) + 'px');
            }
        };
    }
    start() {
        this.cancelPatch = BdApi.monkeyPatch(BdApi.findModule(m => m.displayName === 'Upload').prototype, 'render', {
            after: _ => {
                requestAnimationFrame(this.addButtonToDescription.bind(this));
            }
        });
        BdApi.injectCSS('EditUploads', `
            #EditUploadsEditButton {
               padding: 0;
               background: none;
            }

            #EditUploadsEditButton:hover {
                background-color: transparent;
                text-decoration: underline;
            }

            #EditUploadsModal {
                z-index: 9999;
                width: 90%;
                height: 90%;
                position: fixed;
                display: block;
                top: 5%;
                left: 5%;
                background-color: rgb(40,42,47);
                box-shadow: 0 0 40px rgba(0,0,0,0.75);
                border-radius: 1em;
                color: white;
                overflow: hidden;
            }

            #EditUploadsToolbar {
                background-color: rgb(20,21,23);
                padding: 1em 0 0.5em;
                text-align: center;
                position: absolute;
                bottom: 0;
                width: 100%;
            }

            #EditUploadsToolbar .tool {
                margin-right: 5px;
                margin-left: 5px;
                cursor: pointer;
                padding: 5px 4px 3px;
                border-radius: 5px;
            }

            #EditUploadsToolbar .tool:hover {
                background-color: rgba(255,255,255,0.25);
            }

            #EditUploadsToolbar .toolIconWrapper {
                position: relative;
            }

            #EditUploadsToolbar .toolIconWrapper:hover::after {
                content: attr(aria-label);
                text-transform: capitalize;
                background: black;
                border: 2px solid #222;
                border-radius: 5px;
                padding: 0.25ex 1ch;
                position: absolute;
                bottom: calc(28px + 0.75ch); left: 0;
                transform: translateX(calc(21px - 50%));
                box-shadow: 0 2px 5px rgba(0,0,0,0.35);
                z-index: 999999;
                white-space: nowrap;
            }

            #EditUploadsToolbar .selected .tool {
                background-color: rgba(255,255,255,0.25);
            }

            #EditUploadsToolbar .tool:active {
                background-color: rgba(0,0,0,0.75);
            }

            #EditUploadsToolbar .toolSettings {
                display: none;
                position: relative;
                top: -8px;
                text-transform: capitalize;
                padding-right: 0.5ch;
                border-right: 1px solid rgba(255,255,255,0.25);
            }

            #EditUploadsModal .toolSettings input {
                margin: 0 1ch;
                position: relative;
                top: 3.5px;
                padding: 0;
                border: none;
            }

            #EditUploadsModal .toolSettings input[type="color"] {
                top: 7px;
                background: none;
            }

            #EditUploadsModal .toolSettings input[type="color"]::-webkit-color-swatch-wrapper {
                padding: 0;
            }

            #EditUploadsModal .toolSettings input[type="color"]::-webkit-color-swatch {
                border: none;
                border-radius: 5px;
            }

            #EditUploadsModal .selected .toolSettings {
                display: inline;
            }

            #EditUploadsModal .dividerLeft,
            #EditUploadsModal .dividerRight {
                position: relative;
            }

            #EditUploadsModal .dividerLeft::before {
                content: "";
                width: 1px;
                height: 100%;
                position: absolute;
                left: 0;
                top: -8px;
                background-color: rgba(255,255,255,0.25);
            }
            
            #EditUploadsModal .dividerRight::after {
                content: "";
                width: 1px;
                height: 100%;
                position: absolute;
                right: 0;
                top: -8px;
                background-color: rgba(255,255,255,0.25);
            }

            #EditUploadsCanvasWrapper {
                position: absolute;
                height: calc(100% - 14px - 2.5em);
                width: 100%;
                left: 0;
                top: 0;
                text-align: center;
            }

            #EditUploadsCanvas {
                display: inline;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }
        `);
    }
    stop() {
        this.cancelPatch();
        BdApi.clearCSS('EditUploads');
    }
    createIcon(icon, label) {
        const iconWrapper = document.createElement('span');
        const img = document.createElement('img');
        img.src = icon;
        img.className = 'tool';
        img.width = 20;
        img.height = 20;
        iconWrapper.setAttribute('aria-label', label);
        iconWrapper.className = 'toolIconWrapper';
        iconWrapper.appendChild(img);
        return iconWrapper;
    }
    createToolbarButton(icon, label) {
        const span = document.createElement('span');
        const iconWrapper = this.createIcon(icon, label);
        span.className = 'toolWrapper';
        span.appendChild(iconWrapper);
        return span;
    }
    createUndo(toolbar, canvas, ctx, that) {
        const eraser = that.tools.find(t => t.name === 'erase');
        const span = document.createElement('span');
        const undoButton = this.createToolbarButton(this.icons.undo, 'undo');
        const canvasHistory = [
            [ctx.getImageData(0, 0, canvas.width, canvas.height), [0, 0, canvas.width, canvas.height]]
        ];
        const undoHistory = [];
        const undo = () => {
            if (!canvasHistory.length)
                return;
            const [last, lastCrop] = canvasHistory.pop();
            if (last) {
                undoHistory.push([ctx.getImageData(0, 0, canvas.width, canvas.height), eraser.crop]);
                [canvas.width, canvas.height] = [last.width, last.height];
                ctx.putImageData(last, 0, 0);
                that.fitCanvas(canvas, canvas.parentNode);
                eraser.crop = lastCrop;
                that.currentTool.selected(canvas, ctx, that.toolHelpers);
            }
        };
        undoButton.addEventListener('click', undo);
        span.appendChild(undoButton);
        const redoButton = this.createToolbarButton(this.icons.redo, 'redo');
        const redo = () => {
            if (!undoHistory.length)
                return;
            const [next, nextCrop] = undoHistory.pop();
            if (next) {
                canvasHistory.push([ctx.getImageData(0, 0, canvas.width, canvas.height), eraser.crop]);
                [canvas.width, canvas.height] = [next.width, next.height];
                ctx.putImageData(next, 0, 0);
                that.fitCanvas(canvas, canvas.parentNode);
                eraser.crop = nextCrop;
                that.currentTool.selected(canvas, ctx, that.toolHelpers);
            }
        };
        redoButton.addEventListener('click', redo);
        span.appendChild(redoButton);
        span.style.marginRight = '5px';
        span.classList.add('dividerRight');
        toolbar.appendChild(span);
        const undoFunc = () => {
            undoHistory.length = 0;
            canvasHistory.push([ctx.getImageData(0, 0, canvas.width, canvas.height), eraser.crop]);
            if (canvasHistory.length > 20) {
                canvasHistory.shift();
            }
        };
        return [undoFunc, undo, redo];
    }
    createSaveDefaultSettings() {
        const span = document.createElement('span');
        span.style.marginLeft = '5px';
        span.style.paddingLeft = '5px';
        span.classList.add('dividerLeft');
        const button = this.createToolbarButton(this.icons.save, 'save tool settings');
        button.addEventListener('click', _ => {
            this.tools.forEach((tool) => {
                for (var key in tool.settings) {
                    const setting = tool.settings[key];
                    if (setting.value) {
                        this.setToolDefault(tool.name, key, setting.value);
                        setting.default = setting.value;
                    }
                }
            });
        });
        span.appendChild(button);
        return span;
    }
    restoreToolDefaults() {
        this.tools.forEach((tool) => {
            for (var key in tool.settings) {
                const setting = tool.settings[key];
                setting.default = this.getToolDefault(tool.name, key) || setting.default;
            }
        });
    }
    setToolDefault(tool, setting, value) {
        return BdApi.saveData('EditUploads', `${tool}_${setting}_default`, value);
    }
    getToolDefault(tool, setting) {
        return BdApi.loadData('EditUploads', `${tool}_${setting}_default`);
    }
    createToolSettings(tool, canvas, ctx) {
        const span = document.createElement('span');
        span.className = 'toolSettings';
        for (var key in tool.settings) {
            const setting = tool.settings[key];
            span.appendChild(document.createTextNode(' ' + key));
            const input = Object.assign(document.createElement('input'), setting);
            if (setting.default) {
                input.value = setting.default;
                setting.value = setting.default;
            }
            input.addEventListener('input', _ => {
                setting.value = input.value;
                tool.selected(canvas, ctx, this.toolHelpers);
            });
            span.appendChild(input);
        }
        return span;
    }
    createTools(toolbar, canvas, ctx) {
        const [undoChangeFunction, undoFunc, redoFunc] = this.createUndo(toolbar, canvas, ctx, this);
        this.currentTool = null;
        this.tools.forEach(function (tool) {
            tool.initialize(canvas, ctx, this.tools);
            const item = this.createToolbarButton(tool.icon, tool.name);
            item.appendChild(this.createToolSettings(tool, canvas, ctx));
            item.firstElementChild.firstElementChild.addEventListener('click', _ => {
                if (this.currentTool === tool) {
                    this.currentTool = null;
                    const selected = toolbar.querySelector('.toolWrapper.selected');
                    if (selected)
                        selected.classList.remove('selected');
                    return;
                }
                const selected = toolbar.querySelector('.toolWrapper.selected');
                if (selected)
                    selected.classList.remove('selected');
                tool.selected(canvas, ctx, this.toolHelpers);
                this.currentTool = tool;
                item.classList.add('selected');
            });
            toolbar.appendChild(item);
        }.bind(this));
        canvas.addEventListener('mousedown', e => {
            this.mouseCurrentlyDown = true;
            if (!this.currentTool)
                return;
            undoChangeFunction();
            const scaleFactor = canvas.width / parseInt(canvas.style.width);
            const { left: x, top: y } = canvas.getBoundingClientRect();
            const canvasX = (e.clientX - x) * scaleFactor;
            const canvasY = (e.clientY - y) * scaleFactor;
            this.currentTool.mouseDown.bind(this.currentTool)(canvas, ctx, { x: canvasX, y: canvasY }, this.toolHelpers);
        });
        const mousemoveHandler = e => {
            if (!this.currentTool)
                return;
            if (this.mouseCurrentlyDown) {
                const scaleFactor = canvas.width / parseInt(canvas.style.width);
                const { left: x, top: y } = canvas.getBoundingClientRect();
                const canvasX = (e.clientX - x) * scaleFactor;
                const canvasY = (e.clientY - y) * scaleFactor;
                this.currentTool.mouseMove.bind(this.currentTool)(canvas, ctx, { x: canvasX, y: canvasY }, this.toolHelpers);
            }
        };
        document.body.addEventListener('mousemove', mousemoveHandler);
        const mouseupHandler = e => {
            if (!this.mouseCurrentlyDown)
                return;
            this.mouseCurrentlyDown = false;
            if (!this.currentTool)
                return;
            const scaleFactor = canvas.width / parseInt(canvas.style.width);
            const { left: x, top: y } = canvas.getBoundingClientRect();
            const canvasX = (e.clientX - x) * scaleFactor;
            const canvasY = (e.clientY - y) * scaleFactor;
            this.currentTool.mouseUp.bind(this.currentTool)(canvas, ctx, { x: canvasX, y: canvasY }, this.toolHelpers);
        };
        document.body.addEventListener('mouseup', mouseupHandler);
        return [{ up: mouseupHandler, move: mousemoveHandler }, undoFunc, redoFunc];
    }
    createModal(canvas, ctx, confirm) {
        const cleanup = () => {
            modal.remove();
            document.removeEventListener('keydown', keyDownHandler);
            document.body.removeEventListener('mouseup', handlers.up);
            document.body.removeEventListener('mousemove', handlers.move);
            document.getElementsByClassName(this.uploadModalClass)[0].getElementsByTagName('textarea')[0].focus();
        };
        const modal = document.createElement('div');
        modal.id = 'EditUploadsModal';
        const toolbar = document.createElement('div');
        toolbar.id = 'EditUploadsToolbar';
        const [handlers, undoFunc, redoFunc] = this.createTools(toolbar, canvas, ctx);
        function keyDownHandler(e) {
            if (e.keyCode === 13)
                e.preventDefault(), e.stopPropagation();
            if (e.keyCode === 27)
                e.preventDefault(), e.stopPropagation(), cleanup();
            if (e.keyCode === 90 /*z*/ && (e.ctrlKey || e.metaKey)) {
                undoFunc();
                return;
            }
            if (e.keyCode === 89 /*y*/ && (e.ctrlKey || e.metaKey)) {
                redoFunc();
                return;
            }
            if (e.keyCode === 83 /*s*/ && (e.ctrlKey || e.metaKey)) {
                confirm();
                cleanup();
                return;
            }
        }
        document.addEventListener('keydown', keyDownHandler);
        toolbar.appendChild(this.createSaveDefaultSettings());
        const confirmButton = this.createToolbarButton(this.icons.check, 'done');
        confirmButton.addEventListener('click', _ => {
            confirm();
            cleanup();
        });
        toolbar.appendChild(confirmButton);
        modal.appendChild(toolbar);
        const canvasWrapper = document.createElement('div');
        canvasWrapper.id = 'EditUploadsCanvasWrapper';
        canvas.id = 'EditUploadsCanvas';
        canvasWrapper.appendChild(canvas);
        modal.appendChild(canvasWrapper);
        const closeButton = document.createElement('span');
        closeButton.innerText = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '2ch';
        closeButton.style.right = '3ex';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '100';
        closeButton.addEventListener('click', cleanup);
        modal.appendChild(closeButton);
        return modal;
    }
    fitCanvas(canvas, wrapper) {
        const { width, height } = wrapper.getBoundingClientRect();
        const canvasAspectRatio = canvas.width / canvas.height;
        const wrapperAspectRatio = width / height;
        wrapperAspectRatio >= canvasAspectRatio ?
            (canvas.style.height = height + 'px') && (canvas.style.width = (height * canvasAspectRatio) + 'px')
            : (canvas.style.width = width + 'px') && (canvas.style.height = (width / canvasAspectRatio) + 'px');
    }
    editFile(file, modalWrapper) {
        return new Promise(resolve => {
            const reader = new FileReader();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.onload = _ => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                modalWrapper.appendChild(this.createModal(canvas, ctx, _ => {
                    canvas.toBlob(blob => {
                        resolve(new File([blob], file.name, {
                            type: file.type
                        }));
                    });
                }));
                const canvasWrapper = document.getElementById('EditUploadsCanvasWrapper');
                this.fitCanvas(canvas, canvasWrapper);
            };
            reader.onload = _ => {
                image.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }
    startEdit() {
        const uploadModal = document.getElementsByClassName(this.uploadModalClass)[0];
        const modalWrapper = uploadModal.parentNode.parentNode.parentNode;
        const reactInstance = this.getReactInstance(uploadModal);
        const stateNode = reactInstance.return.stateNode;
        const icon = uploadModal.getElementsByClassName(this.iconClass)[0];
        this.editFile(reactInstance.return.stateNode.state.upload.file, modalWrapper)
            .then((newFile) => {
            stateNode.setState({
                upload: Object.assign(stateNode.state.upload, {
                    file: newFile,
                    size: newFile.size
                }),
                file: newFile
            });
            this.getReactInstance(icon).return.stateNode.forceUpdate();
        });
    }
    createButton() {
        const button = document.createElement('button');
        button.id = 'EditUploadsEditButton';
        button.className = 'button';
        button.style.minWidth = '0px';
        const span = document.createElement('span');
        span.innerText = 'Edit';
        button.appendChild(span);
        button.addEventListener('click', this.startEdit.bind(this));
        return button;
    }
    addButtonToDescription() {
        const reactInstace = this.getReactInstance(document.getElementsByClassName(this.uploadModalClass)[0]);
        if (!(reactInstace && reactInstace.return.stateNode.state.upload && reactInstace.return.stateNode.state.upload.isImage))
            return;
        if (document.getElementById('EditUploadsEditButton'))
            return;
        const desc = document.getElementsByClassName(this.descriptionClass)[0];
        desc.appendChild(this.createButton());
    }
}
