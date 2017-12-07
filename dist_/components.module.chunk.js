webpackJsonp(["components.module"],{

/***/ "./node_modules/ng2-tree/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tree_types_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.types.js");
exports.TreeModelSettings = tree_types_1.TreeModelSettings;
exports.FoldingType = tree_types_1.FoldingType;
var tree_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.js");
exports.Tree = tree_1.Tree;
var menu_events_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/menu.events.js");
exports.NodeMenuItemAction = menu_events_1.NodeMenuItemAction;
var tree_events_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.events.js");
exports.NodeEvent = tree_events_1.NodeEvent;
exports.NodeCreatedEvent = tree_events_1.NodeCreatedEvent;
exports.NodeRemovedEvent = tree_events_1.NodeRemovedEvent;
exports.NodeRenamedEvent = tree_events_1.NodeRenamedEvent;
exports.NodeMovedEvent = tree_events_1.NodeMovedEvent;
exports.NodeSelectedEvent = tree_events_1.NodeSelectedEvent;
exports.NodeExpandedEvent = tree_events_1.NodeExpandedEvent;
exports.NodeCollapsedEvent = tree_events_1.NodeCollapsedEvent;
exports.MenuItemSelectedEvent = tree_events_1.MenuItemSelectedEvent;
exports.NodeDestructiveEvent = tree_events_1.NodeDestructiveEvent;
var tree_component_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.component.js");
exports.TreeComponent = tree_component_1.TreeComponent;
var tree_module_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.module.js");
exports.TreeModule = tree_module_1.TreeModule;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/draggable/captured-node.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CapturedNode = (function () {
    function CapturedNode(anElement, aTree) {
        this.anElement = anElement;
        this.aTree = aTree;
    }
    CapturedNode.prototype.canBeDroppedAt = function (element) {
        return !this.sameAs(element) && !this.contains(element);
    };
    CapturedNode.prototype.contains = function (other) {
        return this.element.nativeElement.contains(other.nativeElement);
    };
    CapturedNode.prototype.sameAs = function (other) {
        return this.element === other;
    };
    Object.defineProperty(CapturedNode.prototype, "element", {
        get: function () {
            return this.anElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CapturedNode.prototype, "tree", {
        get: function () {
            return this.aTree;
        },
        enumerable: true,
        configurable: true
    });
    return CapturedNode;
}());
exports.CapturedNode = CapturedNode;
//# sourceMappingURL=captured-node.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/draggable/draggable.events.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NodeDraggableEvent = (function () {
    function NodeDraggableEvent(captured, target) {
        this.captured = captured;
        this.target = target;
    }
    return NodeDraggableEvent;
}());
exports.NodeDraggableEvent = NodeDraggableEvent;
//# sourceMappingURL=draggable.events.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/draggable/node-draggable.directive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var node_draggable_service_1 = __webpack_require__("./node_modules/ng2-tree/src/draggable/node-draggable.service.js");
var captured_node_1 = __webpack_require__("./node_modules/ng2-tree/src/draggable/captured-node.js");
var tree_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.js");
var NodeDraggableDirective = (function () {
    function NodeDraggableDirective(element, nodeDraggableService, renderer) {
        this.element = element;
        this.nodeDraggableService = nodeDraggableService;
        this.renderer = renderer;
        this.disposersForDragListeners = [];
        this.nodeNativeElement = element.nativeElement;
    }
    NodeDraggableDirective.prototype.ngOnInit = function () {
        if (!this.tree.isStatic()) {
            this.renderer.setAttribute(this.nodeNativeElement, 'draggable', 'true');
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragenter', this.handleDragEnter.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragover', this.handleDragOver.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragstart', this.handleDragStart.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragleave', this.handleDragLeave.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'drop', this.handleDrop.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragend', this.handleDragEnd.bind(this)));
        }
    };
    NodeDraggableDirective.prototype.ngOnDestroy = function () {
        /* tslint:disable:typedef */
        this.disposersForDragListeners.forEach(function (dispose) { return dispose(); });
        /* tslint:enable:typedef */
    };
    NodeDraggableDirective.prototype.handleDragStart = function (e) {
        e.stopPropagation();
        this.nodeDraggableService.captureNode(new captured_node_1.CapturedNode(this.nodeDraggable, this.tree));
        e.dataTransfer.setData('text', NodeDraggableDirective.DATA_TRANSFER_STUB_DATA);
        e.dataTransfer.effectAllowed = 'move';
    };
    NodeDraggableDirective.prototype.handleDragOver = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    NodeDraggableDirective.prototype.handleDragEnter = function (e) {
        e.preventDefault();
        if (this.containsElementAt(e)) {
            this.addClass('over-drop-target');
        }
    };
    NodeDraggableDirective.prototype.handleDragLeave = function (e) {
        if (!this.containsElementAt(e)) {
            this.removeClass('over-drop-target');
        }
    };
    NodeDraggableDirective.prototype.handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.removeClass('over-drop-target');
        if (!this.isDropPossible(e)) {
            return false;
        }
        if (this.nodeDraggableService.getCapturedNode()) {
            return this.notifyThatNodeWasDropped();
        }
    };
    NodeDraggableDirective.prototype.isDropPossible = function (e) {
        var capturedNode = this.nodeDraggableService.getCapturedNode();
        return capturedNode
            && capturedNode.canBeDroppedAt(this.nodeDraggable)
            && this.containsElementAt(e);
    };
    NodeDraggableDirective.prototype.handleDragEnd = function (e) {
        this.removeClass('over-drop-target');
        this.nodeDraggableService.releaseCapturedNode();
    };
    NodeDraggableDirective.prototype.containsElementAt = function (e) {
        var _a = e.x, x = _a === void 0 ? e.clientX : _a, _b = e.y, y = _b === void 0 ? e.clientY : _b;
        return this.nodeNativeElement.contains(document.elementFromPoint(x, y));
    };
    NodeDraggableDirective.prototype.addClass = function (className) {
        var classList = this.nodeNativeElement.classList;
        classList.add(className);
    };
    NodeDraggableDirective.prototype.removeClass = function (className) {
        var classList = this.nodeNativeElement.classList;
        classList.remove(className);
    };
    NodeDraggableDirective.prototype.notifyThatNodeWasDropped = function () {
        this.nodeDraggableService.fireNodeDragged(this.nodeDraggableService.getCapturedNode(), this.nodeDraggable);
    };
    NodeDraggableDirective.DATA_TRANSFER_STUB_DATA = 'some browsers enable drag-n-drop only when dataTransfer has data';
    NodeDraggableDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[nodeDraggable]'
                },] },
    ];
    /** @nocollapse */
    NodeDraggableDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
        { type: node_draggable_service_1.NodeDraggableService, decorators: [{ type: core_1.Inject, args: [node_draggable_service_1.NodeDraggableService,] },] },
        { type: core_1.Renderer2, decorators: [{ type: core_1.Inject, args: [core_1.Renderer2,] },] },
    ]; };
    NodeDraggableDirective.propDecorators = {
        "nodeDraggable": [{ type: core_1.Input },],
        "tree": [{ type: core_1.Input },],
    };
    return NodeDraggableDirective;
}());
exports.NodeDraggableDirective = NodeDraggableDirective;
//# sourceMappingURL=node-draggable.directive.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/draggable/node-draggable.service.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var Subject_1 = __webpack_require__("./node_modules/rxjs/Subject.js");
var draggable_events_1 = __webpack_require__("./node_modules/ng2-tree/src/draggable/draggable.events.js");
var NodeDraggableService = (function () {
    function NodeDraggableService() {
        this.draggableNodeEvents$ = new Subject_1.Subject();
    }
    NodeDraggableService.prototype.fireNodeDragged = function (captured, target) {
        if (!captured.tree || captured.tree.isStatic()) {
            return;
        }
        this.draggableNodeEvents$.next(new draggable_events_1.NodeDraggableEvent(captured, target));
    };
    NodeDraggableService.prototype.captureNode = function (node) {
        this.capturedNode = node;
    };
    NodeDraggableService.prototype.getCapturedNode = function () {
        return this.capturedNode;
    };
    NodeDraggableService.prototype.releaseCapturedNode = function () {
        this.capturedNode = null;
    };
    NodeDraggableService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    NodeDraggableService.ctorParameters = function () { return []; };
    return NodeDraggableService;
}());
exports.NodeDraggableService = NodeDraggableService;
//# sourceMappingURL=node-draggable.service.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/editable/editable.events.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NodeEditableEventAction;
(function (NodeEditableEventAction) {
    NodeEditableEventAction[NodeEditableEventAction["Cancel"] = 0] = "Cancel";
})(NodeEditableEventAction = exports.NodeEditableEventAction || (exports.NodeEditableEventAction = {}));
//# sourceMappingURL=editable.events.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/editable/node-editable.directive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var editable_events_1 = __webpack_require__("./node_modules/ng2-tree/src/editable/editable.events.js");
var NodeEditableDirective = (function () {
    function NodeEditableDirective(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        /* tslint:enable:no-input-rename */
        this.valueChanged = new core_1.EventEmitter(false);
    }
    NodeEditableDirective.prototype.ngOnInit = function () {
        var nativeElement = this.elementRef.nativeElement;
        if (nativeElement) {
            nativeElement.focus();
        }
        this.renderer.setProperty(nativeElement, 'value', this.nodeValue);
    };
    NodeEditableDirective.prototype.applyNewValue = function (newNodeValue) {
        this.valueChanged.emit({ type: 'keyup', value: newNodeValue });
    };
    NodeEditableDirective.prototype.applyNewValueByLoosingFocus = function (newNodeValue) {
        this.valueChanged.emit({ type: 'blur', value: newNodeValue });
    };
    NodeEditableDirective.prototype.cancelEditing = function () {
        this.valueChanged.emit({
            type: 'keyup',
            value: this.nodeValue,
            action: editable_events_1.NodeEditableEventAction.Cancel
        });
    };
    NodeEditableDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[nodeEditable]'
                },] },
    ];
    /** @nocollapse */
    NodeEditableDirective.ctorParameters = function () { return [
        { type: core_1.Renderer2, decorators: [{ type: core_1.Inject, args: [core_1.Renderer2,] },] },
        { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
    ]; };
    NodeEditableDirective.propDecorators = {
        "nodeValue": [{ type: core_1.Input, args: ['nodeEditable',] },],
        "valueChanged": [{ type: core_1.Output },],
        "applyNewValue": [{ type: core_1.HostListener, args: ['keyup.enter', ['$event.target.value'],] },],
        "applyNewValueByLoosingFocus": [{ type: core_1.HostListener, args: ['blur', ['$event.target.value'],] },],
        "cancelEditing": [{ type: core_1.HostListener, args: ['keyup.esc',] },],
    };
    return NodeEditableDirective;
}());
exports.NodeEditableDirective = NodeEditableDirective;
//# sourceMappingURL=node-editable.directive.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/menu/menu.events.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NodeMenuItemAction;
(function (NodeMenuItemAction) {
    NodeMenuItemAction[NodeMenuItemAction["NewFolder"] = 0] = "NewFolder";
    NodeMenuItemAction[NodeMenuItemAction["NewTag"] = 1] = "NewTag";
    NodeMenuItemAction[NodeMenuItemAction["Rename"] = 2] = "Rename";
    NodeMenuItemAction[NodeMenuItemAction["Remove"] = 3] = "Remove";
    NodeMenuItemAction[NodeMenuItemAction["Custom"] = 4] = "Custom";
})(NodeMenuItemAction = exports.NodeMenuItemAction || (exports.NodeMenuItemAction = {}));
var NodeMenuAction;
(function (NodeMenuAction) {
    NodeMenuAction[NodeMenuAction["Close"] = 0] = "Close";
})(NodeMenuAction = exports.NodeMenuAction || (exports.NodeMenuAction = {}));
//# sourceMappingURL=menu.events.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/menu/node-menu.component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var node_menu_service_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/node-menu.service.js");
var menu_events_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/menu.events.js");
var event_utils_1 = __webpack_require__("./node_modules/ng2-tree/src/utils/event.utils.js");
var NodeMenuComponent = (function () {
    function NodeMenuComponent(renderer, nodeMenuService) {
        this.renderer = renderer;
        this.nodeMenuService = nodeMenuService;
        this.menuItemSelected = new core_1.EventEmitter();
        this.availableMenuItems = [
            {
                name: 'New tag',
                action: menu_events_1.NodeMenuItemAction.NewTag,
                cssClass: 'new-tag'
            },
            {
                name: 'New folder',
                action: menu_events_1.NodeMenuItemAction.NewFolder,
                cssClass: 'new-folder'
            },
            {
                name: 'Rename',
                action: menu_events_1.NodeMenuItemAction.Rename,
                cssClass: 'rename'
            },
            {
                name: 'Remove',
                action: menu_events_1.NodeMenuItemAction.Remove,
                cssClass: 'remove'
            }
        ];
        this.disposersForGlobalListeners = [];
    }
    NodeMenuComponent.prototype.ngOnInit = function () {
        this.availableMenuItems = this.menuItems || this.availableMenuItems;
        this.disposersForGlobalListeners.push(this.renderer.listen('document', 'keyup', this.closeMenu.bind(this)));
        this.disposersForGlobalListeners.push(this.renderer.listen('document', 'mousedown', this.closeMenu.bind(this)));
    };
    NodeMenuComponent.prototype.ngOnDestroy = function () {
        this.disposersForGlobalListeners.forEach(function (dispose) { return dispose(); });
    };
    NodeMenuComponent.prototype.onMenuItemSelected = function (e, selectedMenuItem) {
        if (event_utils_1.isLeftButtonClicked(e)) {
            this.menuItemSelected.emit({
                nodeMenuItemAction: selectedMenuItem.action,
                nodeMenuItemSelected: selectedMenuItem.name
            });
            this.nodeMenuService.fireMenuEvent(e.target, menu_events_1.NodeMenuAction.Close);
        }
    };
    NodeMenuComponent.prototype.closeMenu = function (e) {
        var mouseClicked = e instanceof MouseEvent;
        // Check if the click is fired on an element inside a menu
        var containingTarget = (this.menuContainer.nativeElement !== e.target && this.menuContainer.nativeElement.contains(e.target));
        if (mouseClicked && !containingTarget || event_utils_1.isEscapePressed(e)) {
            this.nodeMenuService.fireMenuEvent(e.target, menu_events_1.NodeMenuAction.Close);
        }
    };
    NodeMenuComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'node-menu',
                    template: "\n    <div class=\"node-menu\">\n      <ul class=\"node-menu-content\" #menuContainer>\n        <li class=\"node-menu-item\" *ngFor=\"let menuItem of availableMenuItems\"\n          (click)=\"onMenuItemSelected($event, menuItem)\">\n          <div class=\"node-menu-item-icon {{menuItem.cssClass}}\"></div>\n          <span class=\"node-menu-item-value\">{{menuItem.name}}</span>\n        </li>\n      </ul>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    NodeMenuComponent.ctorParameters = function () { return [
        { type: core_1.Renderer2, decorators: [{ type: core_1.Inject, args: [core_1.Renderer2,] },] },
        { type: node_menu_service_1.NodeMenuService, decorators: [{ type: core_1.Inject, args: [node_menu_service_1.NodeMenuService,] },] },
    ]; };
    NodeMenuComponent.propDecorators = {
        "menuItemSelected": [{ type: core_1.Output },],
        "menuItems": [{ type: core_1.Input },],
        "menuContainer": [{ type: core_1.ViewChild, args: ['menuContainer',] },],
    };
    return NodeMenuComponent;
}());
exports.NodeMenuComponent = NodeMenuComponent;
//# sourceMappingURL=node-menu.component.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/menu/node-menu.service.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var Subject_1 = __webpack_require__("./node_modules/rxjs/Subject.js");
var menu_events_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/menu.events.js");
var NodeMenuService = (function () {
    function NodeMenuService() {
        this.nodeMenuEvents$ = new Subject_1.Subject();
    }
    NodeMenuService.prototype.fireMenuEvent = function (sender, action) {
        var nodeMenuEvent = { sender: sender, action: action };
        this.nodeMenuEvents$.next(nodeMenuEvent);
    };
    NodeMenuService.prototype.hideMenuStream = function (treeElementRef) {
        return this.nodeMenuEvents$
            .filter(function (e) { return treeElementRef.nativeElement !== e.sender; })
            .filter(function (e) { return e.action === menu_events_1.NodeMenuAction.Close; });
    };
    NodeMenuService.prototype.hideMenuForAllNodesExcept = function (treeElementRef) {
        this.nodeMenuEvents$.next({
            sender: treeElementRef.nativeElement,
            action: menu_events_1.NodeMenuAction.Close
        });
    };
    NodeMenuService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    NodeMenuService.ctorParameters = function () { return []; };
    return NodeMenuService;
}());
exports.NodeMenuService = NodeMenuService;
//# sourceMappingURL=node-menu.service.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/rxjs-imports.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./node_modules/rxjs/add/operator/filter.js");
__webpack_require__("./node_modules/rxjs/add/observable/of.js");
// This forces angular compiler to generate a "rxjs-imports.metadata.json"
// with a valid metadata instead of "[null]"
exports.noop = function () { };
//# sourceMappingURL=rxjs-imports.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree-controller.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var menu_events_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/menu.events.js");
var event_utils_1 = __webpack_require__("./node_modules/ng2-tree/src/utils/event.utils.js");
var TreeController = (function () {
    function TreeController(component) {
        this.component = component;
        this.tree = this.component.tree;
        this.treeService = this.component.treeService;
    }
    TreeController.prototype.select = function () {
        if (!this.isSelected()) {
            this.component.onNodeSelected({ button: event_utils_1.MouseButtons.Left });
        }
    };
    TreeController.prototype.isSelected = function () {
        return this.component.isSelected;
    };
    TreeController.prototype.expand = function () {
        if (this.isCollapsed()) {
            this.component.onSwitchFoldingType();
        }
    };
    TreeController.prototype.isExpanded = function () {
        return this.tree.isNodeExpanded();
    };
    TreeController.prototype.collapse = function () {
        if (this.isExpanded()) {
            this.component.onSwitchFoldingType();
        }
    };
    TreeController.prototype.isCollapsed = function () {
        return this.tree.isNodeCollapsed();
    };
    TreeController.prototype.toTreeModel = function () {
        return this.tree.toTreeModel();
    };
    TreeController.prototype.rename = function (newValue) {
        this.tree.markAsBeingRenamed();
        this.component.applyNewValue({ type: 'keyup', value: newValue });
    };
    TreeController.prototype.remove = function () {
        this.component.onMenuItemSelected({ nodeMenuItemAction: menu_events_1.NodeMenuItemAction.Remove });
    };
    TreeController.prototype.addChild = function (newNode) {
        if (this.tree.hasDeferredChildren() && !this.tree.childrenWereLoaded()) {
            return;
        }
        var newTree = this.tree.createNode(Array.isArray(newNode.children), newNode);
        this.treeService.fireNodeCreated(newTree);
    };
    TreeController.prototype.changeNodeId = function (id) {
        if (!id) {
            throw Error('You should supply an id!');
        }
        if (this.treeService.hasController(id)) {
            throw Error("Controller already exists for the given id: " + id);
        }
        this.treeService.deleteController(this.tree.id);
        this.tree.id = id;
        this.treeService.setController(this.tree.id, this);
    };
    TreeController.prototype.reloadChildren = function () {
        this.tree.reloadChildren();
    };
    TreeController.prototype.setChildren = function (children) {
        if (!this.tree.isLeaf()) {
            this.tree.setChildren(children);
        }
    };
    TreeController.prototype.startRenaming = function () {
        this.tree.markAsBeingRenamed();
    };
    return TreeController;
}());
exports.TreeController = TreeController;
//# sourceMappingURL=tree-controller.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree-internal.component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var TreeTypes = __webpack_require__("./node_modules/ng2-tree/src/tree.types.js");
var tree_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.js");
var tree_controller_1 = __webpack_require__("./node_modules/ng2-tree/src/tree-controller.js");
var node_menu_service_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/node-menu.service.js");
var menu_events_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/menu.events.js");
var editable_events_1 = __webpack_require__("./node_modules/ng2-tree/src/editable/editable.events.js");
var tree_service_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.service.js");
var EventUtils = __webpack_require__("./node_modules/ng2-tree/src/utils/event.utils.js");
var fn_utils_1 = __webpack_require__("./node_modules/ng2-tree/src/utils/fn.utils.js");
var TreeInternalComponent = (function () {
    function TreeInternalComponent(nodeMenuService, treeService, element) {
        this.nodeMenuService = nodeMenuService;
        this.treeService = treeService;
        this.element = element;
        this.isSelected = false;
        this.isRightMenuVisible = false;
        this.isLeftMenuVisible = false;
        this.subscriptions = [];
    }
    TreeInternalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.controller = new tree_controller_1.TreeController(this);
        if (fn_utils_1.get(this.tree, 'node.id', '')) {
            this.treeService.setController(this.tree.node.id, this.controller);
        }
        this.settings = this.settings || { rootIsVisible: true };
        this.subscriptions.push(this.nodeMenuService.hideMenuStream(this.element)
            .subscribe(function () {
            _this.isRightMenuVisible = false;
            _this.isLeftMenuVisible = false;
        }));
        this.subscriptions.push(this.treeService.unselectStream(this.tree)
            .subscribe(function () { return _this.isSelected = false; }));
        this.subscriptions.push(this.treeService.draggedStream(this.tree, this.element)
            .subscribe(function (e) {
            if (_this.tree.hasSibling(e.captured.tree)) {
                _this.swapWithSibling(e.captured.tree, _this.tree);
            }
            else if (_this.tree.isBranch()) {
                _this.moveNodeToThisTreeAndRemoveFromPreviousOne(e, _this.tree);
            }
            else {
                _this.moveNodeToParentTreeAndRemoveFromPreviousOne(e, _this.tree);
            }
        }));
    };
    TreeInternalComponent.prototype.ngOnChanges = function (changes) {
        this.controller = new tree_controller_1.TreeController(this);
    };
    TreeInternalComponent.prototype.ngOnDestroy = function () {
        if (fn_utils_1.get(this.tree, 'node.id', '')) {
            this.treeService.deleteController(this.tree.node.id);
        }
        this.subscriptions.forEach(function (sub) { return sub && sub.unsubscribe(); });
    };
    TreeInternalComponent.prototype.swapWithSibling = function (sibling, tree) {
        tree.swapWithSibling(sibling);
        this.treeService.fireNodeMoved(sibling, sibling.parent);
    };
    TreeInternalComponent.prototype.moveNodeToThisTreeAndRemoveFromPreviousOne = function (e, tree) {
        this.treeService.fireNodeRemoved(e.captured.tree);
        var addedChild = tree.addChild(e.captured.tree);
        this.treeService.fireNodeMoved(addedChild, e.captured.tree.parent);
    };
    TreeInternalComponent.prototype.moveNodeToParentTreeAndRemoveFromPreviousOne = function (e, tree) {
        this.treeService.fireNodeRemoved(e.captured.tree);
        var addedSibling = tree.addSibling(e.captured.tree, tree.positionInParent);
        this.treeService.fireNodeMoved(addedSibling, e.captured.tree.parent);
    };
    TreeInternalComponent.prototype.onNodeSelected = function (e) {
        if (EventUtils.isLeftButtonClicked(e)) {
            this.isSelected = true;
            this.treeService.fireNodeSelected(this.tree);
        }
    };
    TreeInternalComponent.prototype.showRightMenu = function (e) {
        if (!this.tree.hasRightMenu()) {
            return;
        }
        if (EventUtils.isRightButtonClicked(e)) {
            this.isRightMenuVisible = !this.isRightMenuVisible;
            this.nodeMenuService.hideMenuForAllNodesExcept(this.element);
        }
        e.preventDefault();
    };
    TreeInternalComponent.prototype.showLeftMenu = function (e) {
        if (!this.tree.hasLeftMenu()) {
            return;
        }
        if (EventUtils.isLeftButtonClicked(e)) {
            this.isLeftMenuVisible = !this.isLeftMenuVisible;
            this.nodeMenuService.hideMenuForAllNodesExcept(this.element);
            if (this.isLeftMenuVisible) {
                e.preventDefault();
            }
        }
    };
    TreeInternalComponent.prototype.onMenuItemSelected = function (e) {
        switch (e.nodeMenuItemAction) {
            case menu_events_1.NodeMenuItemAction.NewTag:
                this.onNewSelected(e);
                break;
            case menu_events_1.NodeMenuItemAction.NewFolder:
                this.onNewSelected(e);
                break;
            case menu_events_1.NodeMenuItemAction.Rename:
                this.onRenameSelected();
                break;
            case menu_events_1.NodeMenuItemAction.Remove:
                this.onRemoveSelected();
                break;
            case menu_events_1.NodeMenuItemAction.Custom:
                this.treeService.fireMenuItemSelected(this.tree, e.nodeMenuItemSelected);
                break;
            default:
                throw new Error("Chosen menu item doesn't exist");
        }
    };
    TreeInternalComponent.prototype.onNewSelected = function (e) {
        this.tree.createNode(e.nodeMenuItemAction === menu_events_1.NodeMenuItemAction.NewFolder);
        this.isRightMenuVisible = false;
        this.isLeftMenuVisible = false;
    };
    TreeInternalComponent.prototype.onRenameSelected = function () {
        this.tree.markAsBeingRenamed();
        this.isRightMenuVisible = false;
        this.isLeftMenuVisible = false;
    };
    TreeInternalComponent.prototype.onRemoveSelected = function () {
        this.treeService.deleteController(fn_utils_1.get(this.tree, 'node.id', ''));
        this.treeService.fireNodeRemoved(this.tree);
    };
    TreeInternalComponent.prototype.onSwitchFoldingType = function () {
        this.tree.switchFoldingType();
        this.treeService.fireNodeSwitchFoldingType(this.tree);
    };
    TreeInternalComponent.prototype.applyNewValue = function (e) {
        if ((e.action === editable_events_1.NodeEditableEventAction.Cancel || this.tree.isNew()) && tree_1.Tree.isValueEmpty(e.value)) {
            return this.treeService.fireNodeRemoved(this.tree);
        }
        if (this.tree.isNew()) {
            this.tree.value = e.value;
            this.treeService.fireNodeCreated(this.tree);
        }
        if (this.tree.isBeingRenamed()) {
            var oldValue = this.tree.value;
            this.tree.value = e.value;
            this.treeService.fireNodeRenamed(oldValue, this.tree);
        }
        this.tree.markAsModified();
    };
    TreeInternalComponent.prototype.shouldShowInputForTreeValue = function () {
        return this.tree.isNew() || this.tree.isBeingRenamed();
    };
    TreeInternalComponent.prototype.isRootHidden = function () {
        return this.tree.isRoot() && !this.settings.rootIsVisible;
    };
    TreeInternalComponent.prototype.hasCustomMenu = function () {
        return this.tree.hasCustomMenu();
    };
    TreeInternalComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'tree-internal',
                    template: "\n  <ul class=\"tree\" *ngIf=\"tree\" [ngClass]=\"{rootless: isRootHidden()}\">\n    <li>\n      <div class=\"value-container\"\n        [ngClass]=\"{rootless: isRootHidden()}\"\n        [class.selected]=\"isSelected\"\n        (contextmenu)=\"showRightMenu($event)\"\n        [nodeDraggable]=\"element\"\n        [tree]=\"tree\">\n\n        <div class=\"folding\" (click)=\"onSwitchFoldingType()\" [ngClass]=\"tree.foldingCssClass\"></div>\n        <div class=\"node-value\"\n          *ngIf=\"!shouldShowInputForTreeValue()\"\n          [class.node-selected]=\"isSelected\"\n          (click)=\"onNodeSelected($event)\">\n            <div *ngIf=\"tree.nodeTemplate\" class=\"node-template\" [innerHTML]=\"tree.nodeTemplate | safeHtml\"></div>\n            <span *ngIf=\"!template\" class=\"node-name\" [innerHTML]=\"tree.value | safeHtml\"></span>\n            <span class=\"loading-children\" *ngIf=\"tree.childrenAreBeingLoaded()\"></span>\n            <ng-template [ngTemplateOutlet]=\"template\" [ngTemplateOutletContext]=\"{ $implicit: tree.node }\"></ng-template>\n        </div>\n\n        <input type=\"text\" class=\"node-value\"\n           *ngIf=\"shouldShowInputForTreeValue()\"\n           [nodeEditable]=\"tree.value\"\n           (valueChanged)=\"applyNewValue($event)\"/>\n\n        <div class=\"node-left-menu\" *ngIf=\"tree.hasLeftMenu()\" (click)=\"showLeftMenu($event)\" [innerHTML]=\"tree.leftMenuTemplate\">\n        </div>\n        <node-menu *ngIf=\"tree.hasLeftMenu() && isLeftMenuVisible && !hasCustomMenu()\"\n          (menuItemSelected)=\"onMenuItemSelected($event)\">\n        </node-menu>\n      </div>\n\n      <node-menu *ngIf=\"isRightMenuVisible && !hasCustomMenu()\"\n           (menuItemSelected)=\"onMenuItemSelected($event)\">\n      </node-menu>\n\n      <node-menu *ngIf=\"hasCustomMenu() && (isRightMenuVisible || isLeftMenuVisible)\"\n           [menuItems]=\"tree.menuItems\"\n           (menuItemSelected)=\"onMenuItemSelected($event)\">\n      </node-menu>\n      <ng-template [ngIf]=\"tree.isNodeExpanded()\">\n        <tree-internal *ngFor=\"let child of tree.childrenAsync | async\" [tree]=\"child\" [template]=\"template\"></tree-internal>\n      </ng-template>\n    </li>\n  </ul>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeInternalComponent.ctorParameters = function () { return [
        { type: node_menu_service_1.NodeMenuService, },
        { type: tree_service_1.TreeService, },
        { type: core_1.ElementRef, },
    ]; };
    TreeInternalComponent.propDecorators = {
        "tree": [{ type: core_1.Input },],
        "settings": [{ type: core_1.Input },],
        "template": [{ type: core_1.Input },],
    };
    return TreeInternalComponent;
}());
exports.TreeInternalComponent = TreeInternalComponent;
//# sourceMappingURL=tree-internal.component.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree.component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var tree_service_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.service.js");
var TreeTypes = __webpack_require__("./node_modules/ng2-tree/src/tree.types.js");
var tree_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.js");
var TreeComponent = (function () {
    function TreeComponent(treeService) {
        this.treeService = treeService;
        this.nodeCreated = new core_1.EventEmitter();
        this.nodeRemoved = new core_1.EventEmitter();
        this.nodeRenamed = new core_1.EventEmitter();
        this.nodeSelected = new core_1.EventEmitter();
        this.nodeMoved = new core_1.EventEmitter();
        this.nodeExpanded = new core_1.EventEmitter();
        this.nodeCollapsed = new core_1.EventEmitter();
        this.menuItemSelected = new core_1.EventEmitter();
        this.loadNextLevel = new core_1.EventEmitter();
        this.subscriptions = [];
    }
    TreeComponent.prototype.ngOnChanges = function (changes) {
        if (!this.treeModel) {
            this.tree = TreeComponent.EMPTY_TREE;
        }
        else {
            this.tree = new tree_1.Tree(this.treeModel);
        }
    };
    TreeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this.treeService.nodeRemoved$.subscribe(function (e) {
            _this.nodeRemoved.emit(e);
        }));
        this.subscriptions.push(this.treeService.nodeRenamed$.subscribe(function (e) {
            _this.nodeRenamed.emit(e);
        }));
        this.subscriptions.push(this.treeService.nodeCreated$.subscribe(function (e) {
            _this.nodeCreated.emit(e);
        }));
        this.subscriptions.push(this.treeService.nodeSelected$.subscribe(function (e) {
            _this.nodeSelected.emit(e);
        }));
        this.subscriptions.push(this.treeService.nodeMoved$.subscribe(function (e) {
            _this.nodeMoved.emit(e);
        }));
        this.subscriptions.push(this.treeService.nodeExpanded$.subscribe(function (e) {
            _this.nodeExpanded.emit(e);
        }));
        this.subscriptions.push(this.treeService.nodeCollapsed$.subscribe(function (e) {
            _this.nodeCollapsed.emit(e);
        }));
        this.subscriptions.push(this.treeService.menuItemSelected$.subscribe(function (e) {
            _this.menuItemSelected.emit(e);
        }));
        this.subscriptions.push(this.treeService.loadNextLevel$.subscribe(function (e) {
            _this.loadNextLevel.emit(e);
        }));
    };
    TreeComponent.prototype.getController = function () {
        return this.rootComponent.controller;
    };
    TreeComponent.prototype.getControllerByNodeId = function (id) {
        return this.treeService.getController(id);
    };
    TreeComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub && sub.unsubscribe(); });
    };
    TreeComponent.EMPTY_TREE = new tree_1.Tree({ value: '' });
    TreeComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'tree',
                    template: "<tree-internal #rootComponent [tree]=\"tree\" [settings]=\"settings\" [template]=\"template\"></tree-internal>",
                    providers: [tree_service_1.TreeService]
                },] },
    ];
    /** @nocollapse */
    TreeComponent.ctorParameters = function () { return [
        { type: tree_service_1.TreeService, decorators: [{ type: core_1.Inject, args: [tree_service_1.TreeService,] },] },
    ]; };
    TreeComponent.propDecorators = {
        "treeModel": [{ type: core_1.Input, args: ['tree',] },],
        "settings": [{ type: core_1.Input },],
        "nodeCreated": [{ type: core_1.Output },],
        "nodeRemoved": [{ type: core_1.Output },],
        "nodeRenamed": [{ type: core_1.Output },],
        "nodeSelected": [{ type: core_1.Output },],
        "nodeMoved": [{ type: core_1.Output },],
        "nodeExpanded": [{ type: core_1.Output },],
        "nodeCollapsed": [{ type: core_1.Output },],
        "menuItemSelected": [{ type: core_1.Output },],
        "loadNextLevel": [{ type: core_1.Output },],
        "rootComponent": [{ type: core_1.ViewChild, args: ['rootComponent',] },],
        "template": [{ type: core_1.ContentChild, args: [core_1.TemplateRef,] },],
    };
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=tree.component.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree.events.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NodeEvent = (function () {
    function NodeEvent(node) {
        this.node = node;
    }
    return NodeEvent;
}());
exports.NodeEvent = NodeEvent;
var NodeSelectedEvent = (function (_super) {
    __extends(NodeSelectedEvent, _super);
    function NodeSelectedEvent(node) {
        return _super.call(this, node) || this;
    }
    return NodeSelectedEvent;
}(NodeEvent));
exports.NodeSelectedEvent = NodeSelectedEvent;
var NodeDestructiveEvent = (function (_super) {
    __extends(NodeDestructiveEvent, _super);
    function NodeDestructiveEvent(node) {
        return _super.call(this, node) || this;
    }
    return NodeDestructiveEvent;
}(NodeEvent));
exports.NodeDestructiveEvent = NodeDestructiveEvent;
var NodeMovedEvent = (function (_super) {
    __extends(NodeMovedEvent, _super);
    function NodeMovedEvent(node, previousParent) {
        var _this = _super.call(this, node) || this;
        _this.previousParent = previousParent;
        return _this;
    }
    return NodeMovedEvent;
}(NodeDestructiveEvent));
exports.NodeMovedEvent = NodeMovedEvent;
var NodeRemovedEvent = (function (_super) {
    __extends(NodeRemovedEvent, _super);
    function NodeRemovedEvent(node, lastIndex) {
        var _this = _super.call(this, node) || this;
        _this.lastIndex = lastIndex;
        return _this;
    }
    return NodeRemovedEvent;
}(NodeDestructiveEvent));
exports.NodeRemovedEvent = NodeRemovedEvent;
var NodeCreatedEvent = (function (_super) {
    __extends(NodeCreatedEvent, _super);
    function NodeCreatedEvent(node) {
        return _super.call(this, node) || this;
    }
    return NodeCreatedEvent;
}(NodeDestructiveEvent));
exports.NodeCreatedEvent = NodeCreatedEvent;
var NodeRenamedEvent = (function (_super) {
    __extends(NodeRenamedEvent, _super);
    function NodeRenamedEvent(node, oldValue, newValue) {
        var _this = _super.call(this, node) || this;
        _this.oldValue = oldValue;
        _this.newValue = newValue;
        return _this;
    }
    return NodeRenamedEvent;
}(NodeDestructiveEvent));
exports.NodeRenamedEvent = NodeRenamedEvent;
var NodeExpandedEvent = (function (_super) {
    __extends(NodeExpandedEvent, _super);
    function NodeExpandedEvent(node) {
        return _super.call(this, node) || this;
    }
    return NodeExpandedEvent;
}(NodeEvent));
exports.NodeExpandedEvent = NodeExpandedEvent;
var NodeCollapsedEvent = (function (_super) {
    __extends(NodeCollapsedEvent, _super);
    function NodeCollapsedEvent(node) {
        return _super.call(this, node) || this;
    }
    return NodeCollapsedEvent;
}(NodeEvent));
exports.NodeCollapsedEvent = NodeCollapsedEvent;
var MenuItemSelectedEvent = (function (_super) {
    __extends(MenuItemSelectedEvent, _super);
    function MenuItemSelectedEvent(node, selectedItem) {
        var _this = _super.call(this, node) || this;
        _this.selectedItem = selectedItem;
        return _this;
    }
    return MenuItemSelectedEvent;
}(NodeEvent));
exports.MenuItemSelectedEvent = MenuItemSelectedEvent;
var LoadNextLevelEvent = (function (_super) {
    __extends(LoadNextLevelEvent, _super);
    function LoadNextLevelEvent(node) {
        return _super.call(this, node) || this;
    }
    return LoadNextLevelEvent;
}(NodeEvent));
exports.LoadNextLevelEvent = LoadNextLevelEvent;
//# sourceMappingURL=tree.events.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fn_utils_1 = __webpack_require__("./node_modules/ng2-tree/src/utils/fn.utils.js");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var tree_types_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.types.js");
var uuidv4 = __webpack_require__("./node_modules/uuid/v4.js");
var ChildrenLoadingState;
(function (ChildrenLoadingState) {
    ChildrenLoadingState[ChildrenLoadingState["NotStarted"] = 0] = "NotStarted";
    ChildrenLoadingState[ChildrenLoadingState["Loading"] = 1] = "Loading";
    ChildrenLoadingState[ChildrenLoadingState["Completed"] = 2] = "Completed";
})(ChildrenLoadingState || (ChildrenLoadingState = {}));
var Tree = (function () {
    /**
     * Build an instance of Tree from an object implementing TreeModel interface.
     * @param {TreeModel} model - A model that is used to build a tree.
     * @param {Tree} [parent] - An optional parent if you want to build a tree from the model that should be a child of an existing Tree instance.
     * @param {boolean} [isBranch] - An option that makes a branch from created tree. Branch can have children.
     */
    function Tree(node, parent, isBranch) {
        if (parent === void 0) { parent = null; }
        if (isBranch === void 0) { isBranch = false; }
        var _this = this;
        this._childrenLoadingState = ChildrenLoadingState.NotStarted;
        this._childrenAsyncOnce = fn_utils_1.once(function () {
            return new Observable_1.Observable(function (observer) {
                setTimeout(function () {
                    _this._childrenLoadingState = ChildrenLoadingState.Loading;
                    _this._loadChildren(function (children) {
                        _this._children = (children || []).map(function (child) { return new Tree(child, _this); });
                        _this._childrenLoadingState = ChildrenLoadingState.Completed;
                        observer.next(_this.children);
                        observer.complete();
                    });
                });
            });
        });
        this.buildTreeFromModel(node, parent, isBranch || Array.isArray(node.children));
    }
    // STATIC METHODS ----------------------------------------------------------------------------------------------------
    /**
     * Check that value passed is not empty (it doesn't consist of only whitespace symbols).
     * @param {string} value - A value that should be checked.
     * @returns {boolean} - A flag indicating that value is empty or not.
     * @static
     */
    // STATIC METHODS ----------------------------------------------------------------------------------------------------
    /**
       * Check that value passed is not empty (it doesn't consist of only whitespace symbols).
       * @param {string} value - A value that should be checked.
       * @returns {boolean} - A flag indicating that value is empty or not.
       * @static
       */
    Tree.isValueEmpty = 
    // STATIC METHODS ----------------------------------------------------------------------------------------------------
    /**
       * Check that value passed is not empty (it doesn't consist of only whitespace symbols).
       * @param {string} value - A value that should be checked.
       * @returns {boolean} - A flag indicating that value is empty or not.
       * @static
       */
    function (value) {
        return fn_utils_1.isEmpty(fn_utils_1.trim(value));
    };
    /**
     * Check whether a given value can be considered RenamableNode.
     * @param {any} value - A value to check.
     * @returns {boolean} - A flag indicating whether given value is Renamable node or not.
     * @static
     */
    /**
       * Check whether a given value can be considered RenamableNode.
       * @param {any} value - A value to check.
       * @returns {boolean} - A flag indicating whether given value is Renamable node or not.
       * @static
       */
    Tree.isRenamable = /**
       * Check whether a given value can be considered RenamableNode.
       * @param {any} value - A value to check.
       * @returns {boolean} - A flag indicating whether given value is Renamable node or not.
       * @static
       */
    function (value) {
        return (fn_utils_1.has(value, 'setName') && fn_utils_1.isFunction(value.setName))
            && (fn_utils_1.has(value, 'toString') && fn_utils_1.isFunction(value.toString) && value.toString !== Object.toString);
    };
    Tree.cloneTreeShallow = function (origin) {
        var tree = new Tree(Object.assign({}, origin.node));
        tree._children = origin._children;
        return tree;
    };
    Tree.applyNewValueToRenamable = function (value, newValue) {
        var renamableValue = Object.assign({}, value);
        renamableValue.setName(newValue);
        return renamableValue;
    };
    Tree.prototype.buildTreeFromModel = function (model, parent, isBranch) {
        var _this = this;
        this.parent = parent;
        this.node = Object.assign(fn_utils_1.omit(model, 'children'), {
            settings: tree_types_1.TreeModelSettings.merge(model, fn_utils_1.get(parent, 'node'))
        }, { emitLoadNextLevel: model.emitLoadNextLevel === true });
        if (fn_utils_1.isFunction(this.node.loadChildren)) {
            this._loadChildren = this.node.loadChildren;
        }
        else {
            fn_utils_1.get(model, 'children', []).forEach(function (child, index) {
                _this._addChild(new Tree(child, _this), index);
            });
        }
        if (!Array.isArray(this._children)) {
            this._children = this.node.loadChildren || isBranch ? [] : null;
        }
    };
    Tree.prototype.hasDeferredChildren = function () {
        return typeof this._loadChildren === 'function';
    };
    /* Setting the children loading state to Loading since a request was dispatched to the client */
    /* Setting the children loading state to Loading since a request was dispatched to the client */
    Tree.prototype.loadingChildrenRequested = /* Setting the children loading state to Loading since a request was dispatched to the client */
    function () {
        this._childrenLoadingState = ChildrenLoadingState.Loading;
    };
    /**
     * Check whether children of the node are being loaded.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children are being loaded.
     */
    /**
       * Check whether children of the node are being loaded.
       * Makes sense only for nodes that define `loadChildren` function.
       * @returns {boolean} A flag indicating that children are being loaded.
       */
    Tree.prototype.childrenAreBeingLoaded = /**
       * Check whether children of the node are being loaded.
       * Makes sense only for nodes that define `loadChildren` function.
       * @returns {boolean} A flag indicating that children are being loaded.
       */
    function () {
        return (this._childrenLoadingState === ChildrenLoadingState.Loading);
    };
    /**
     * Check whether children of the node were loaded.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children were loaded.
     */
    /**
       * Check whether children of the node were loaded.
       * Makes sense only for nodes that define `loadChildren` function.
       * @returns {boolean} A flag indicating that children were loaded.
       */
    Tree.prototype.childrenWereLoaded = /**
       * Check whether children of the node were loaded.
       * Makes sense only for nodes that define `loadChildren` function.
       * @returns {boolean} A flag indicating that children were loaded.
       */
    function () {
        return (this._childrenLoadingState === ChildrenLoadingState.Completed);
    };
    Tree.prototype.canLoadChildren = function () {
        return (this._childrenLoadingState === ChildrenLoadingState.NotStarted)
            && (this.foldingType === tree_types_1.FoldingType.Expanded)
            && (!!this._loadChildren);
    };
    /**
     * Check whether children of the node should be loaded and not loaded yet.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children should be loaded for the current node.
     */
    /**
       * Check whether children of the node should be loaded and not loaded yet.
       * Makes sense only for nodes that define `loadChildren` function.
       * @returns {boolean} A flag indicating that children should be loaded for the current node.
       */
    Tree.prototype.childrenShouldBeLoaded = /**
       * Check whether children of the node should be loaded and not loaded yet.
       * Makes sense only for nodes that define `loadChildren` function.
       * @returns {boolean} A flag indicating that children should be loaded for the current node.
       */
    function () {
        return !this.childrenWereLoaded() && (!!this._loadChildren || this.node.emitLoadNextLevel === true);
    };
    Object.defineProperty(Tree.prototype, "children", {
        /**
         * Get children of the current tree.
         * @returns {Tree[]} The children of the current tree.
         */
        get: /**
           * Get children of the current tree.
           * @returns {Tree[]} The children of the current tree.
           */
        function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "childrenAsync", {
        /**
         * By getting value from this property you start process of loading node's children using `loadChildren` function.
         * Once children are loaded `loadChildren` function won't be called anymore and loaded for the first time children are emitted in case of subsequent calls.
         * @returns {Observable<Tree[]>} An observable which emits children once they are loaded.
         */
        get: /**
           * By getting value from this property you start process of loading node's children using `loadChildren` function.
           * Once children are loaded `loadChildren` function won't be called anymore and loaded for the first time children are emitted in case of subsequent calls.
           * @returns {Observable<Tree[]>} An observable which emits children once they are loaded.
           */
        function () {
            if (this.canLoadChildren()) {
                return this._childrenAsyncOnce();
            }
            return Observable_1.Observable.of(this.children);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * By calling this method you start process of loading node's children using `loadChildren` function.
     */
    /**
       * By calling this method you start process of loading node's children using `loadChildren` function.
       */
    Tree.prototype.reloadChildren = /**
       * By calling this method you start process of loading node's children using `loadChildren` function.
       */
    function () {
        var _this = this;
        if (this.childrenShouldBeLoaded()) {
            this._childrenLoadingState = ChildrenLoadingState.Loading;
            this._loadChildren(function (children) {
                _this._children = children && children.map(function (child) { return new Tree(child, _this); });
                _this._childrenLoadingState = ChildrenLoadingState.Completed;
            });
        }
    };
    /**
     * By calling this method you will remove all current children of a treee and create new.
     */
    /**
       * By calling this method you will remove all current children of a treee and create new.
       */
    Tree.prototype.setChildren = /**
       * By calling this method you will remove all current children of a treee and create new.
       */
    function (children) {
        var _this = this;
        this._children = children && children.map(function (child) { return new Tree(child, _this); });
        if (this.childrenShouldBeLoaded()) {
            this._childrenLoadingState = ChildrenLoadingState.Completed;
        }
    };
    /**
     * Create a new node in the current tree.
     * @param {boolean} isBranch - A flag that indicates whether a new node should be a "Branch". "Leaf" node will be created by default
     * @param {TreeModel} model - Tree model of the new node which will be inserted. Empty node will be created by default and it will fire edit mode of this node
     * @returns {Tree} A newly created child node.
     */
    /**
       * Create a new node in the current tree.
       * @param {boolean} isBranch - A flag that indicates whether a new node should be a "Branch". "Leaf" node will be created by default
       * @param {TreeModel} model - Tree model of the new node which will be inserted. Empty node will be created by default and it will fire edit mode of this node
       * @returns {Tree} A newly created child node.
       */
    Tree.prototype.createNode = /**
       * Create a new node in the current tree.
       * @param {boolean} isBranch - A flag that indicates whether a new node should be a "Branch". "Leaf" node will be created by default
       * @param {TreeModel} model - Tree model of the new node which will be inserted. Empty node will be created by default and it will fire edit mode of this node
       * @returns {Tree} A newly created child node.
       */
    function (isBranch, model) {
        if (model === void 0) { model = { value: '' }; }
        var tree = new Tree(model, this, isBranch);
        if (!model.id) {
            tree.markAsNew();
        }
        tree.id = tree.id || uuidv4();
        if (this.childrenShouldBeLoaded() && !(this.childrenAreBeingLoaded() || this.childrenWereLoaded())) {
            return null;
        }
        if (this.isLeaf()) {
            return this.addSibling(tree);
        }
        else {
            return this.addChild(tree);
        }
    };
    Object.defineProperty(Tree.prototype, "value", {
        /**
         * Get the value of the current node
         * @returns {(string|RenamableNode)} The value of the node.
         */
        get: /**
           * Get the value of the current node
           * @returns {(string|RenamableNode)} The value of the node.
           */
        function () {
            return this.node.value;
        },
        /**
         * Set the value of the current node
         * @param {(string|RenamableNode)} value - The new value of the node.
         */
        set: /**
           * Set the value of the current node
           * @param {(string|RenamableNode)} value - The new value of the node.
           */
        function (value) {
            if (typeof value !== 'string' && !Tree.isRenamable(value)) {
                return;
            }
            var stringifiedValue = '' + value;
            if (Tree.isRenamable(this.value)) {
                this.node.value = Tree.applyNewValueToRenamable(this.value, stringifiedValue);
            }
            else {
                this.node.value = Tree.isValueEmpty(stringifiedValue) ? this.node.value : stringifiedValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add a sibling node for the current node. This won't work if the current node is a root.
     * @param {Tree} sibling - A node that should become a sibling.
     * @param [number] position - Position in which sibling will be inserted. By default it will be inserted at the last position in a parent.
     * @returns {Tree} A newly inserted sibling, or null if you are trying to make a sibling for the root.
     */
    /**
       * Add a sibling node for the current node. This won't work if the current node is a root.
       * @param {Tree} sibling - A node that should become a sibling.
       * @param [number] position - Position in which sibling will be inserted. By default it will be inserted at the last position in a parent.
       * @returns {Tree} A newly inserted sibling, or null if you are trying to make a sibling for the root.
       */
    Tree.prototype.addSibling = /**
       * Add a sibling node for the current node. This won't work if the current node is a root.
       * @param {Tree} sibling - A node that should become a sibling.
       * @param [number] position - Position in which sibling will be inserted. By default it will be inserted at the last position in a parent.
       * @returns {Tree} A newly inserted sibling, or null if you are trying to make a sibling for the root.
       */
    function (sibling, position) {
        if (Array.isArray(fn_utils_1.get(this.parent, 'children'))) {
            return this.parent.addChild(sibling, position);
        }
        return null;
    };
    /**
     * Add a child node for the current node.
     * @param {Tree} child - A node that should become a child.
     * @param [number] position - Position in which child will be inserted. By default it will be inserted at the last position in a parent.
     * @returns {Tree} A newly inserted child.
     */
    /**
       * Add a child node for the current node.
       * @param {Tree} child - A node that should become a child.
       * @param [number] position - Position in which child will be inserted. By default it will be inserted at the last position in a parent.
       * @returns {Tree} A newly inserted child.
       */
    Tree.prototype.addChild = /**
       * Add a child node for the current node.
       * @param {Tree} child - A node that should become a child.
       * @param [number] position - Position in which child will be inserted. By default it will be inserted at the last position in a parent.
       * @returns {Tree} A newly inserted child.
       */
    function (child, position) {
        var newborn = this._addChild(Tree.cloneTreeShallow(child), position);
        this._setFoldingType();
        if (this.isNodeCollapsed()) {
            this.switchFoldingType();
        }
        return newborn;
    };
    Tree.prototype._addChild = function (child, position) {
        if (position === void 0) { position = fn_utils_1.size(this._children) || 0; }
        child.parent = this;
        if (Array.isArray(this._children)) {
            this._children.splice(position, 0, child);
        }
        else {
            this._children = [child];
        }
        return child;
    };
    /**
     * Swap position of the current node with the given sibling. If node passed as a parameter is not a sibling - nothing happens.
     * @param {Tree} sibling - A sibling with which current node shold be swapped.
     */
    /**
       * Swap position of the current node with the given sibling. If node passed as a parameter is not a sibling - nothing happens.
       * @param {Tree} sibling - A sibling with which current node shold be swapped.
       */
    Tree.prototype.swapWithSibling = /**
       * Swap position of the current node with the given sibling. If node passed as a parameter is not a sibling - nothing happens.
       * @param {Tree} sibling - A sibling with which current node shold be swapped.
       */
    function (sibling) {
        if (!this.hasSibling(sibling)) {
            return;
        }
        var siblingIndex = sibling.positionInParent;
        var thisTreeIndex = this.positionInParent;
        this.parent._children[siblingIndex] = this;
        this.parent._children[thisTreeIndex] = sibling;
    };
    Object.defineProperty(Tree.prototype, "positionInParent", {
        /**
         * Get a node's position in its parent.
         * @returns {number} The position inside a parent.
         */
        get: /**
           * Get a node's position in its parent.
           * @returns {number} The position inside a parent.
           */
        function () {
            if (this.isRoot()) {
                return -1;
            }
            return this.parent.children ? this.parent.children.indexOf(this) : -1;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check whether or not this tree is static.
     * @returns {boolean} A flag indicating whether or not this tree is static.
     */
    /**
       * Check whether or not this tree is static.
       * @returns {boolean} A flag indicating whether or not this tree is static.
       */
    Tree.prototype.isStatic = /**
       * Check whether or not this tree is static.
       * @returns {boolean} A flag indicating whether or not this tree is static.
       */
    function () {
        return fn_utils_1.get(this.node.settings, 'static', false);
    };
    /**
     * Check whether or not this tree has a left menu.
     * @returns {boolean} A flag indicating whether or not this tree has a left menu.
     */
    /**
       * Check whether or not this tree has a left menu.
       * @returns {boolean} A flag indicating whether or not this tree has a left menu.
       */
    Tree.prototype.hasLeftMenu = /**
       * Check whether or not this tree has a left menu.
       * @returns {boolean} A flag indicating whether or not this tree has a left menu.
       */
    function () {
        return !fn_utils_1.get(this.node.settings, 'static', false) && fn_utils_1.get(this.node.settings, 'leftMenu', false);
    };
    /**
     * Check whether or not this tree has a right menu.
     * @returns {boolean} A flag indicating whether or not this tree has a right menu.
     */
    /**
       * Check whether or not this tree has a right menu.
       * @returns {boolean} A flag indicating whether or not this tree has a right menu.
       */
    Tree.prototype.hasRightMenu = /**
       * Check whether or not this tree has a right menu.
       * @returns {boolean} A flag indicating whether or not this tree has a right menu.
       */
    function () {
        return !fn_utils_1.get(this.node.settings, 'static', false) && fn_utils_1.get(this.node.settings, 'rightMenu', false);
    };
    /**
     * Check whether this tree is "Leaf" or not.
     * @returns {boolean} A flag indicating whether or not this tree is a "Leaf".
     */
    /**
       * Check whether this tree is "Leaf" or not.
       * @returns {boolean} A flag indicating whether or not this tree is a "Leaf".
       */
    Tree.prototype.isLeaf = /**
       * Check whether this tree is "Leaf" or not.
       * @returns {boolean} A flag indicating whether or not this tree is a "Leaf".
       */
    function () {
        return !this.isBranch();
    };
    Object.defineProperty(Tree.prototype, "menuItems", {
        /**
         * Get menu items of the current tree.
         * @returns {NodeMenuItem[]} The menu items of the current tree.
         */
        get: /**
           * Get menu items of the current tree.
           * @returns {NodeMenuItem[]} The menu items of the current tree.
           */
        function () {
            return fn_utils_1.get(this.node.settings, 'menuItems');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check whether or not this tree has a custom menu.
     * @returns {boolean} A flag indicating whether or not this tree has a custom menu.
     */
    /**
       * Check whether or not this tree has a custom menu.
       * @returns {boolean} A flag indicating whether or not this tree has a custom menu.
       */
    Tree.prototype.hasCustomMenu = /**
       * Check whether or not this tree has a custom menu.
       * @returns {boolean} A flag indicating whether or not this tree has a custom menu.
       */
    function () {
        return !this.isStatic() && !!fn_utils_1.get(this.node.settings, 'menuItems', false);
    };
    /**
     * Check whether this tree is "Branch" or not. "Branch" is a node that has children.
     * @returns {boolean} A flag indicating whether or not this tree is a "Branch".
     */
    /**
       * Check whether this tree is "Branch" or not. "Branch" is a node that has children.
       * @returns {boolean} A flag indicating whether or not this tree is a "Branch".
       */
    Tree.prototype.isBranch = /**
       * Check whether this tree is "Branch" or not. "Branch" is a node that has children.
       * @returns {boolean} A flag indicating whether or not this tree is a "Branch".
       */
    function () {
        return this.node.emitLoadNextLevel === true || Array.isArray(this._children);
    };
    /**
     * Check whether this tree has children.
     * @returns {boolean} A flag indicating whether or not this tree has children.
     */
    /**
       * Check whether this tree has children.
       * @returns {boolean} A flag indicating whether or not this tree has children.
       */
    Tree.prototype.hasChildren = /**
       * Check whether this tree has children.
       * @returns {boolean} A flag indicating whether or not this tree has children.
       */
    function () {
        return !fn_utils_1.isEmpty(this._children) || this.childrenShouldBeLoaded();
    };
    /**
     * Check whether this tree is a root or not. The root is the tree (node) that doesn't have parent (or technically its parent is null).
     * @returns {boolean} A flag indicating whether or not this tree is the root.
     */
    /**
       * Check whether this tree is a root or not. The root is the tree (node) that doesn't have parent (or technically its parent is null).
       * @returns {boolean} A flag indicating whether or not this tree is the root.
       */
    Tree.prototype.isRoot = /**
       * Check whether this tree is a root or not. The root is the tree (node) that doesn't have parent (or technically its parent is null).
       * @returns {boolean} A flag indicating whether or not this tree is the root.
       */
    function () {
        return fn_utils_1.isNil(this.parent);
    };
    /**
     * Check whether provided tree is a sibling of the current tree. Sibling trees (nodes) are the trees that have the same parent.
     * @param {Tree} tree - A tree that should be tested on a siblingness.
     * @returns {boolean} A flag indicating whether or not provided tree is the sibling of the current one.
     */
    /**
       * Check whether provided tree is a sibling of the current tree. Sibling trees (nodes) are the trees that have the same parent.
       * @param {Tree} tree - A tree that should be tested on a siblingness.
       * @returns {boolean} A flag indicating whether or not provided tree is the sibling of the current one.
       */
    Tree.prototype.hasSibling = /**
       * Check whether provided tree is a sibling of the current tree. Sibling trees (nodes) are the trees that have the same parent.
       * @param {Tree} tree - A tree that should be tested on a siblingness.
       * @returns {boolean} A flag indicating whether or not provided tree is the sibling of the current one.
       */
    function (tree) {
        return !this.isRoot() && fn_utils_1.includes(this.parent.children, tree);
    };
    /**
     * Check whether provided tree is a child of the current tree.
     * This method tests that provided tree is a <strong>direct</strong> child of the current tree.
     * @param {Tree} tree - A tree that should be tested (child candidate).
     * @returns {boolean} A flag indicating whether provided tree is a child or not.
     */
    /**
       * Check whether provided tree is a child of the current tree.
       * This method tests that provided tree is a <strong>direct</strong> child of the current tree.
       * @param {Tree} tree - A tree that should be tested (child candidate).
       * @returns {boolean} A flag indicating whether provided tree is a child or not.
       */
    Tree.prototype.hasChild = /**
       * Check whether provided tree is a child of the current tree.
       * This method tests that provided tree is a <strong>direct</strong> child of the current tree.
       * @param {Tree} tree - A tree that should be tested (child candidate).
       * @returns {boolean} A flag indicating whether provided tree is a child or not.
       */
    function (tree) {
        return fn_utils_1.includes(this._children, tree);
    };
    /**
     * Remove given tree from the current tree.
     * The given tree will be removed only in case it is a direct child of the current tree (@see {@link hasChild}).
     * @param {Tree} tree - A tree that should be removed.
     */
    /**
       * Remove given tree from the current tree.
       * The given tree will be removed only in case it is a direct child of the current tree (@see {@link hasChild}).
       * @param {Tree} tree - A tree that should be removed.
       */
    Tree.prototype.removeChild = /**
       * Remove given tree from the current tree.
       * The given tree will be removed only in case it is a direct child of the current tree (@see {@link hasChild}).
       * @param {Tree} tree - A tree that should be removed.
       */
    function (tree) {
        if (!this.hasChildren()) {
            return;
        }
        var childIndex = this._children.findIndex(function (child) { return child === tree; });
        if (childIndex >= 0) {
            this._children.splice(childIndex, 1);
        }
        this._setFoldingType();
    };
    /**
     * Remove current tree from its parent.
     */
    /**
       * Remove current tree from its parent.
       */
    Tree.prototype.removeItselfFromParent = /**
       * Remove current tree from its parent.
       */
    function () {
        if (!this.parent) {
            return;
        }
        this.parent.removeChild(this);
    };
    /**
     * Switch folding type of the current tree. "Leaf" node cannot switch its folding type cause it doesn't have children, hence nothing to fold.
     * If node is a "Branch" and it is expanded, then by invoking current method state of the tree should be switched to "collapsed" and vice versa.
     */
    /**
       * Switch folding type of the current tree. "Leaf" node cannot switch its folding type cause it doesn't have children, hence nothing to fold.
       * If node is a "Branch" and it is expanded, then by invoking current method state of the tree should be switched to "collapsed" and vice versa.
       */
    Tree.prototype.switchFoldingType = /**
       * Switch folding type of the current tree. "Leaf" node cannot switch its folding type cause it doesn't have children, hence nothing to fold.
       * If node is a "Branch" and it is expanded, then by invoking current method state of the tree should be switched to "collapsed" and vice versa.
       */
    function () {
        if (this.isLeaf() || !this.hasChildren()) {
            return;
        }
        this.disableCollapseOnInit();
        this.node._foldingType = this.isNodeExpanded() ? tree_types_1.FoldingType.Collapsed : tree_types_1.FoldingType.Expanded;
    };
    /**
     * Check that tree is expanded.
     * @returns {boolean} A flag indicating whether current tree is expanded. Always returns false for the "Leaf" tree and for an empty tree.
     */
    /**
       * Check that tree is expanded.
       * @returns {boolean} A flag indicating whether current tree is expanded. Always returns false for the "Leaf" tree and for an empty tree.
       */
    Tree.prototype.isNodeExpanded = /**
       * Check that tree is expanded.
       * @returns {boolean} A flag indicating whether current tree is expanded. Always returns false for the "Leaf" tree and for an empty tree.
       */
    function () {
        return this.foldingType === tree_types_1.FoldingType.Expanded;
    };
    /**
     * Check that tree is collapsed.
     * @returns {boolean} A flag indicating whether current tree is collapsed. Always returns false for the "Leaf" tree and for an empty tree.
     */
    /**
       * Check that tree is collapsed.
       * @returns {boolean} A flag indicating whether current tree is collapsed. Always returns false for the "Leaf" tree and for an empty tree.
       */
    Tree.prototype.isNodeCollapsed = /**
       * Check that tree is collapsed.
       * @returns {boolean} A flag indicating whether current tree is collapsed. Always returns false for the "Leaf" tree and for an empty tree.
       */
    function () {
        return this.foldingType === tree_types_1.FoldingType.Collapsed;
    };
    /**
     * Set a current folding type: expanded, collapsed or leaf.
     */
    /**
       * Set a current folding type: expanded, collapsed or leaf.
       */
    Tree.prototype._setFoldingType = /**
       * Set a current folding type: expanded, collapsed or leaf.
       */
    function () {
        if (this.childrenShouldBeLoaded()) {
            this.node._foldingType = tree_types_1.FoldingType.Collapsed;
        }
        else if (this._children && !fn_utils_1.isEmpty(this._children)) {
            this.node._foldingType = this.isCollapsedOnInit() ? tree_types_1.FoldingType.Collapsed : tree_types_1.FoldingType.Expanded;
        }
        else if (Array.isArray(this._children)) {
            this.node._foldingType = tree_types_1.FoldingType.Empty;
        }
        else {
            this.node._foldingType = tree_types_1.FoldingType.Leaf;
        }
    };
    Object.defineProperty(Tree.prototype, "foldingType", {
        /**
         * Get a current folding type: expanded, collapsed or leaf.
         * @returns {FoldingType} A folding type of the current tree.
         */
        get: /**
           * Get a current folding type: expanded, collapsed or leaf.
           * @returns {FoldingType} A folding type of the current tree.
           */
        function () {
            if (!this.node._foldingType) {
                this._setFoldingType();
            }
            return this.node._foldingType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "foldingCssClass", {
        /**
         * Get a css class for element which displayes folding state - expanded, collapsed or leaf
         * @returns {string} A string icontaining css class (classes)
         */
        get: /**
           * Get a css class for element which displayes folding state - expanded, collapsed or leaf
           * @returns {string} A string icontaining css class (classes)
           */
        function () {
            return this.getCssClassesFromSettings() || this.foldingType.cssClass;
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.getCssClassesFromSettings = function () {
        if (!this.node._foldingType) {
            this._setFoldingType();
        }
        if (this.node._foldingType === tree_types_1.FoldingType.Collapsed) {
            return fn_utils_1.get(this.node.settings, 'cssClasses.collapsed', null);
        }
        else if (this.node._foldingType === tree_types_1.FoldingType.Expanded) {
            return fn_utils_1.get(this.node.settings, 'cssClasses.expanded', null);
        }
        else if (this.node._foldingType === tree_types_1.FoldingType.Empty) {
            return fn_utils_1.get(this.node.settings, 'cssClasses.empty', null);
        }
        return fn_utils_1.get(this.node.settings, 'cssClasses.leaf', null);
    };
    Object.defineProperty(Tree.prototype, "nodeTemplate", {
        /**
         * Get a html template to render before every node's name.
         * @returns {string} A string representing a html template.
         */
        get: /**
           * Get a html template to render before every node's name.
           * @returns {string} A string representing a html template.
           */
        function () {
            return this.getTemplateFromSettings();
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.getTemplateFromSettings = function () {
        if (this.isLeaf()) {
            return fn_utils_1.get(this.node.settings, 'templates.leaf', '');
        }
        else {
            return fn_utils_1.get(this.node.settings, 'templates.node', '');
        }
    };
    Object.defineProperty(Tree.prototype, "leftMenuTemplate", {
        /**
         * Get a html template to render for an element activatin left menu of a node.
         * @returns {string} A string representing a html template.
         */
        get: /**
           * Get a html template to render for an element activatin left menu of a node.
           * @returns {string} A string representing a html template.
           */
        function () {
            if (this.hasLeftMenu()) {
                return fn_utils_1.get(this.node.settings, 'templates.leftMenu', '<span></span>');
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.disableCollapseOnInit = function () {
        if (this.node.settings) {
            this.node.settings.isCollapsedOnInit = false;
        }
    };
    Tree.prototype.isCollapsedOnInit = function () {
        return !!fn_utils_1.get(this.node.settings, 'isCollapsedOnInit');
    };
    /**
     * Check that current tree is newly created (added by user via menu for example). Tree that was built from the TreeModel is not marked as new.
     * @returns {boolean} A flag whether the tree is new.
     */
    /**
       * Check that current tree is newly created (added by user via menu for example). Tree that was built from the TreeModel is not marked as new.
       * @returns {boolean} A flag whether the tree is new.
       */
    Tree.prototype.isNew = /**
       * Check that current tree is newly created (added by user via menu for example). Tree that was built from the TreeModel is not marked as new.
       * @returns {boolean} A flag whether the tree is new.
       */
    function () {
        return this.node._status === tree_types_1.TreeStatus.New;
    };
    Object.defineProperty(Tree.prototype, "id", {
        get: function () {
            return fn_utils_1.get(this.node, 'id');
        },
        set: function (id) {
            this.node.id = id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Mark current tree as new (@see {@link isNew}).
     */
    /**
       * Mark current tree as new (@see {@link isNew}).
       */
    Tree.prototype.markAsNew = /**
       * Mark current tree as new (@see {@link isNew}).
       */
    function () {
        this.node._status = tree_types_1.TreeStatus.New;
    };
    /**
     * Check that current tree is being renamed (it is in the process of its value renaming initiated by a user).
     * @returns {boolean} A flag whether the tree is being renamed.
     */
    /**
       * Check that current tree is being renamed (it is in the process of its value renaming initiated by a user).
       * @returns {boolean} A flag whether the tree is being renamed.
       */
    Tree.prototype.isBeingRenamed = /**
       * Check that current tree is being renamed (it is in the process of its value renaming initiated by a user).
       * @returns {boolean} A flag whether the tree is being renamed.
       */
    function () {
        return this.node._status === tree_types_1.TreeStatus.IsBeingRenamed;
    };
    /**
     * Mark current tree as being renamed (@see {@link isBeingRenamed}).
     */
    /**
       * Mark current tree as being renamed (@see {@link isBeingRenamed}).
       */
    Tree.prototype.markAsBeingRenamed = /**
       * Mark current tree as being renamed (@see {@link isBeingRenamed}).
       */
    function () {
        this.node._status = tree_types_1.TreeStatus.IsBeingRenamed;
    };
    /**
     * Check that current tree is modified (for example it was renamed).
     * @returns {boolean} A flag whether the tree is modified.
     */
    /**
       * Check that current tree is modified (for example it was renamed).
       * @returns {boolean} A flag whether the tree is modified.
       */
    Tree.prototype.isModified = /**
       * Check that current tree is modified (for example it was renamed).
       * @returns {boolean} A flag whether the tree is modified.
       */
    function () {
        return this.node._status === tree_types_1.TreeStatus.Modified;
    };
    /**
     * Mark current tree as modified (@see {@link isModified}).
     */
    /**
       * Mark current tree as modified (@see {@link isModified}).
       */
    Tree.prototype.markAsModified = /**
       * Mark current tree as modified (@see {@link isModified}).
       */
    function () {
        this.node._status = tree_types_1.TreeStatus.Modified;
    };
    /**
     * Makes a clone of an underlying TreeModel instance
     * @returns {TreeModel} a clone of an underlying TreeModel instance
     */
    /**
       * Makes a clone of an underlying TreeModel instance
       * @returns {TreeModel} a clone of an underlying TreeModel instance
       */
    Tree.prototype.toTreeModel = /**
       * Makes a clone of an underlying TreeModel instance
       * @returns {TreeModel} a clone of an underlying TreeModel instance
       */
    function () {
        var model = fn_utils_1.defaultsDeep(this.isLeaf() ? {} : { children: [] }, this.node);
        if (this.children) {
            this.children.forEach(function (child) {
                model.children.push(child.toTreeModel());
            });
        }
        return model;
    };
    return Tree;
}());
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree.module.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./node_modules/ng2-tree/src/rxjs-imports.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var tree_component_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.component.js");
var tree_internal_component_1 = __webpack_require__("./node_modules/ng2-tree/src/tree-internal.component.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
var node_draggable_directive_1 = __webpack_require__("./node_modules/ng2-tree/src/draggable/node-draggable.directive.js");
var node_draggable_service_1 = __webpack_require__("./node_modules/ng2-tree/src/draggable/node-draggable.service.js");
var node_editable_directive_1 = __webpack_require__("./node_modules/ng2-tree/src/editable/node-editable.directive.js");
var node_menu_component_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/node-menu.component.js");
var node_menu_service_1 = __webpack_require__("./node_modules/ng2-tree/src/menu/node-menu.service.js");
var tree_service_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.service.js");
var safe_html_pipe_1 = __webpack_require__("./node_modules/ng2-tree/src/utils/safe-html.pipe.js");
var TreeModule = (function () {
    function TreeModule() {
    }
    TreeModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [
                        node_draggable_directive_1.NodeDraggableDirective,
                        tree_component_1.TreeComponent,
                        node_editable_directive_1.NodeEditableDirective,
                        node_menu_component_1.NodeMenuComponent,
                        tree_internal_component_1.TreeInternalComponent,
                        safe_html_pipe_1.SafeHtmlPipe
                    ],
                    exports: [tree_component_1.TreeComponent],
                    providers: [node_draggable_service_1.NodeDraggableService, node_menu_service_1.NodeMenuService, tree_service_1.TreeService]
                },] },
    ];
    /** @nocollapse */
    TreeModule.ctorParameters = function () { return []; };
    return TreeModule;
}());
exports.TreeModule = TreeModule;
//# sourceMappingURL=tree.module.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree.service.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tree_events_1 = __webpack_require__("./node_modules/ng2-tree/src/tree.events.js");
var Subject_1 = __webpack_require__("./node_modules/rxjs/Subject.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var node_draggable_service_1 = __webpack_require__("./node_modules/ng2-tree/src/draggable/node-draggable.service.js");
var fn_utils_1 = __webpack_require__("./node_modules/ng2-tree/src/utils/fn.utils.js");
var TreeService = (function () {
    function TreeService(nodeDraggableService) {
        this.nodeDraggableService = nodeDraggableService;
        this.nodeMoved$ = new Subject_1.Subject();
        this.nodeRemoved$ = new Subject_1.Subject();
        this.nodeRenamed$ = new Subject_1.Subject();
        this.nodeCreated$ = new Subject_1.Subject();
        this.nodeSelected$ = new Subject_1.Subject();
        this.nodeExpanded$ = new Subject_1.Subject();
        this.nodeCollapsed$ = new Subject_1.Subject();
        this.menuItemSelected$ = new Subject_1.Subject();
        this.loadNextLevel$ = new Subject_1.Subject();
        this.controllers = new Map();
        this.nodeRemoved$.subscribe(function (e) { return e.node.removeItselfFromParent(); });
    }
    TreeService.prototype.unselectStream = function (tree) {
        return this.nodeSelected$.filter(function (e) { return tree !== e.node; });
    };
    TreeService.prototype.fireNodeRemoved = function (tree) {
        this.nodeRemoved$.next(new tree_events_1.NodeRemovedEvent(tree, tree.positionInParent));
    };
    TreeService.prototype.fireNodeCreated = function (tree) {
        this.nodeCreated$.next(new tree_events_1.NodeCreatedEvent(tree));
    };
    TreeService.prototype.fireNodeSelected = function (tree) {
        this.nodeSelected$.next(new tree_events_1.NodeSelectedEvent(tree));
    };
    TreeService.prototype.fireNodeRenamed = function (oldValue, tree) {
        this.nodeRenamed$.next(new tree_events_1.NodeRenamedEvent(tree, oldValue, tree.value));
    };
    TreeService.prototype.fireNodeMoved = function (tree, parent) {
        this.nodeMoved$.next(new tree_events_1.NodeMovedEvent(tree, parent));
    };
    TreeService.prototype.fireMenuItemSelected = function (tree, selectedItem) {
        this.menuItemSelected$.next(new tree_events_1.MenuItemSelectedEvent(tree, selectedItem));
    };
    TreeService.prototype.fireNodeSwitchFoldingType = function (tree) {
        if (tree.isNodeExpanded()) {
            this.fireNodeExpanded(tree);
            if (this.shouldFireLoadNextLevel(tree)) {
                this.fireLoadNextLevel(tree);
            }
        }
        else if (tree.isNodeCollapsed()) {
            this.fireNodeCollapsed(tree);
        }
    };
    TreeService.prototype.fireNodeExpanded = function (tree) {
        this.nodeExpanded$.next(new tree_events_1.NodeExpandedEvent(tree));
    };
    TreeService.prototype.fireNodeCollapsed = function (tree) {
        this.nodeCollapsed$.next(new tree_events_1.NodeCollapsedEvent(tree));
    };
    TreeService.prototype.fireLoadNextLevel = function (tree) {
        this.loadNextLevel$.next(new tree_events_1.LoadNextLevelEvent(tree));
    };
    TreeService.prototype.draggedStream = function (tree, element) {
        return this.nodeDraggableService.draggableNodeEvents$
            .filter(function (e) { return e.target === element; })
            .filter(function (e) { return !e.captured.tree.hasChild(tree); });
    };
    TreeService.prototype.setController = function (id, controller) {
        this.controllers.set(id, controller);
    };
    TreeService.prototype.deleteController = function (id) {
        if (this.controllers.has(id)) {
            this.controllers.delete(id);
        }
    };
    TreeService.prototype.getController = function (id) {
        if (this.controllers.has(id)) {
            return this.controllers.get(id);
        }
        return null;
    };
    TreeService.prototype.hasController = function (id) {
        return this.controllers.has(id);
    };
    TreeService.prototype.shouldFireLoadNextLevel = function (tree) {
        var shouldLoadNextLevel = tree.node.emitLoadNextLevel &&
            !tree.node.loadChildren &&
            !tree.childrenAreBeingLoaded() &&
            (!tree.children || fn_utils_1.isEmpty(tree.children));
        if (shouldLoadNextLevel) {
            tree.loadingChildrenRequested();
        }
        return shouldLoadNextLevel;
    };
    TreeService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    TreeService.ctorParameters = function () { return [
        { type: node_draggable_service_1.NodeDraggableService, decorators: [{ type: core_1.Inject, args: [node_draggable_service_1.NodeDraggableService,] },] },
    ]; };
    return TreeService;
}());
exports.TreeService = TreeService;
//# sourceMappingURL=tree.service.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/tree.types.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fn_utils_1 = __webpack_require__("./node_modules/ng2-tree/src/utils/fn.utils.js");
var FoldingType = (function () {
    function FoldingType(_cssClass) {
        this._cssClass = _cssClass;
    }
    Object.defineProperty(FoldingType.prototype, "cssClass", {
        get: function () {
            return this._cssClass;
        },
        enumerable: true,
        configurable: true
    });
    FoldingType.Expanded = new FoldingType('node-expanded');
    FoldingType.Collapsed = new FoldingType('node-collapsed');
    FoldingType.Empty = new FoldingType('node-empty');
    FoldingType.Leaf = new FoldingType('node-leaf');
    return FoldingType;
}());
exports.FoldingType = FoldingType;
var TreeModelSettings = (function () {
    function TreeModelSettings() {
    }
    TreeModelSettings.merge = function (sourceA, sourceB) {
        return fn_utils_1.defaultsDeep({}, fn_utils_1.get(sourceA, 'settings'), fn_utils_1.get(sourceB, 'settings'), { static: false, leftMenu: false, rightMenu: true, isCollapsedOnInit: false });
    };
    return TreeModelSettings;
}());
exports.TreeModelSettings = TreeModelSettings;
var TreeStatus;
(function (TreeStatus) {
    TreeStatus[TreeStatus["New"] = 0] = "New";
    TreeStatus[TreeStatus["Modified"] = 1] = "Modified";
    TreeStatus[TreeStatus["IsBeingRenamed"] = 2] = "IsBeingRenamed";
})(TreeStatus = exports.TreeStatus || (exports.TreeStatus = {}));
//# sourceMappingURL=tree.types.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/utils/event.utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Keys;
(function (Keys) {
    Keys[Keys["Escape"] = 27] = "Escape";
})(Keys = exports.Keys || (exports.Keys = {}));
var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["Left"] = 0] = "Left";
    MouseButtons[MouseButtons["Right"] = 2] = "Right";
})(MouseButtons = exports.MouseButtons || (exports.MouseButtons = {}));
function isLeftButtonClicked(e) {
    return e.button === MouseButtons.Left;
}
exports.isLeftButtonClicked = isLeftButtonClicked;
function isRightButtonClicked(e) {
    return e.button === MouseButtons.Right;
}
exports.isRightButtonClicked = isRightButtonClicked;
function isEscapePressed(e) {
    return e.keyCode === Keys.Escape;
}
exports.isEscapePressed = isEscapePressed;
//# sourceMappingURL=event.utils.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/utils/fn.utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isEmpty(value) {
    if (typeof value === 'string') {
        return !/\S/.test(value);
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    return isNil(value);
}
exports.isEmpty = isEmpty;
function trim(value) {
    return isNil(value) ? '' : value.trim();
}
exports.trim = trim;
function has(value, prop) {
    return value && typeof value === 'object' && value.hasOwnProperty(prop);
}
exports.has = has;
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
function get(value, path, defaultValue) {
    var result = value;
    for (var _i = 0, _a = path.split('.'); _i < _a.length; _i++) {
        var prop = _a[_i];
        if (!result || !Reflect.has(result, prop)) {
            return defaultValue;
        }
        result = result[prop];
    }
    return isNil(result) || result === value ? defaultValue : result;
}
exports.get = get;
function omit(value, propToSkip) {
    return Object
        .keys(value)
        .reduce(function (result, prop) {
        if (prop === propToSkip) {
            return result;
        }
        return Object.assign(result, (_a = {}, _a[prop] = value[prop], _a));
        var _a;
    }, {});
}
exports.omit = omit;
function size(value) {
    return isEmpty(value) ? 0 : value.length;
}
exports.size = size;
function once(fn) {
    var result;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (fn) {
            result = fn.apply(null, args);
            fn = null;
        }
        return result;
    };
}
exports.once = once;
function defaultsDeep(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return [target].concat(sources).reduce(function (result, source) {
        if (!source) {
            return result;
        }
        Object.keys(source).forEach(function (prop) {
            if (isNil(result[prop])) {
                result[prop] = source[prop];
                return;
            }
            if (typeof result[prop] === 'object' && !Array.isArray(result[prop])) {
                result[prop] = defaultsDeep(result[prop], source[prop]);
                return;
            }
        });
        return result;
    }, {});
}
exports.defaultsDeep = defaultsDeep;
function includes(target, value) {
    if (isNil(target)) {
        return false;
    }
    var index = typeof target === 'string' ? target.indexOf(value) : target.indexOf(value);
    return index > -1;
}
exports.includes = includes;
function isNil(value) {
    return value === undefined || value === null;
}
exports.isNil = isNil;
//# sourceMappingURL=fn.utils.js.map

/***/ }),

/***/ "./node_modules/ng2-tree/src/utils/safe-html.pipe.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
var SafeHtmlPipe = (function () {
    function SafeHtmlPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafeHtmlPipe.prototype.transform = function (value) {
        // return value;
        return this.sanitizer.bypassSecurityTrustHtml(value);
    };
    SafeHtmlPipe.decorators = [
        { type: core_1.Pipe, args: [{ name: 'safeHtml' },] },
    ];
    /** @nocollapse */
    SafeHtmlPipe.ctorParameters = function () { return [
        { type: platform_browser_1.DomSanitizer, },
    ]; };
    return SafeHtmlPipe;
}());
exports.SafeHtmlPipe = SafeHtmlPipe;
//# sourceMappingURL=safe-html.pipe.js.map

/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng.js":
/***/ (function(module, exports, __webpack_require__) {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var rb = __webpack_require__("crypto").randomBytes;

function rng() {
  return rb(16);
}

module.exports = rng;


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__("./node_modules/uuid/lib/rng.js");
var bytesToUuid = __webpack_require__("./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "./src/app/pages/components/components-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsRoutingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return routedComponents; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_component__ = __webpack_require__("./src/app/pages/components/components.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tree_tree_component__ = __webpack_require__("./src/app/pages/components/tree/tree.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__notifications_notifications_component__ = __webpack_require__("./src/app/pages/components/notifications/notifications.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [{
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_2__components_component__["a" /* ComponentsComponent */],
        children: [
            {
                path: 'tree',
                component: __WEBPACK_IMPORTED_MODULE_3__tree_tree_component__["a" /* TreeComponent */],
            }, {
                path: 'notifications',
                component: __WEBPACK_IMPORTED_MODULE_4__notifications_notifications_component__["a" /* NotificationsComponent */],
            },
        ],
    }];
var ComponentsRoutingModule = (function () {
    function ComponentsRoutingModule() {
    }
    ComponentsRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* RouterModule */]],
        })
    ], ComponentsRoutingModule);
    return ComponentsRoutingModule;
}());

var routedComponents = [
    __WEBPACK_IMPORTED_MODULE_2__components_component__["a" /* ComponentsComponent */],
    __WEBPACK_IMPORTED_MODULE_3__tree_tree_component__["a" /* TreeComponent */],
    __WEBPACK_IMPORTED_MODULE_4__notifications_notifications_component__["a" /* NotificationsComponent */],
];


/***/ }),

/***/ "./src/app/pages/components/components.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsComponent = (function () {
    function ComponentsComponent() {
    }
    ComponentsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'ngx-components',
            template: "\n    <router-outlet></router-outlet>\n  ",
        })
    ], ComponentsComponent);
    return ComponentsComponent;
}());



/***/ }),

/***/ "./src/app/pages/components/components.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentsModule", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_tree__ = __webpack_require__("./node_modules/ng2-tree/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular2_toaster__ = __webpack_require__("./node_modules/angular2-toaster/angular2-toaster.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__theme_theme_module__ = __webpack_require__("./src/app/@theme/theme.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_routing_module__ = __webpack_require__("./src/app/pages/components/components-routing.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__theme_theme_module__["a" /* ThemeModule */],
                __WEBPACK_IMPORTED_MODULE_4__components_routing_module__["a" /* ComponentsRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_1_ng2_tree__["TreeModule"],
                __WEBPACK_IMPORTED_MODULE_2_angular2_toaster__["c" /* ToasterModule */],
            ],
            declarations: __WEBPACK_IMPORTED_MODULE_4__components_routing_module__["b" /* routedComponents */].slice(),
        })
    ], ComponentsModule);
    return ComponentsModule;
}());



/***/ }),

/***/ "./src/app/pages/components/notifications/notifications.component.html":
/***/ (function(module, exports) {

module.exports = "<nb-card>\r\n  <nb-card-header>\r\n    Toaster configuration\r\n  </nb-card-header>\r\n  <nb-card-body>\r\n    <toaster-container [toasterconfig]=\"config\"></toaster-container>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-md-6 col-sm-12\">\r\n        <div class=\"form-group\">\r\n          <label class=\"form-control-label\">Place to show toast:</label>\r\n          <div class=\"dropdown\" ngbDropdown>\r\n            <button class=\"btn btn-primary\" type=\"button\" ngbDropdownToggle>\r\n              {{ position }}\r\n            </button>\r\n            <ul ngbDropdown class=\"dropdown-menu\">\r\n              <li class=\"dropdown-item\" *ngFor=\"let p of positions\" (click)=\"position = p\">\r\n                {{ p }}\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"form-control-label\">Animation type:</label>\r\n          <div class=\"dropdown\" ngbDropdown>\r\n            <button class=\"btn btn-primary\" type=\"button\" ngbDropdownToggle>\r\n              {{ animationType }}\r\n            </button>\r\n            <ul ngbDropdown class=\"dropdown-menu\">\r\n              <li class=\"dropdown-item\" *ngFor=\"let at of animations\" (click)=\"animationType = at\">\r\n                {{ at }}\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"form-control-label\">Title:</label>\r\n          <input class=\"form-control\" [(ngModel)]=\"title\" name=\"title\">\r\n        </div>\r\n        <form>\r\n          <div class=\"form-group\">\r\n            <label class=\"form-control-label\">Content:</label>\r\n            <input class=\"form-control\" [(ngModel)]=\"content\" name=\"content\">\r\n          </div>\r\n        </form>\r\n        <div class=\"form-group\">\r\n          <label class=\"form-control-label\">Time to hide toast, ms. 0 to persistent toast:</label>\r\n          <input class=\"form-control\" type=\"number\" [(ngModel)]=\"timeout\"name=\"timeout\">\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"col-md-6 col-sm-12\">\r\n        <div class=\"form-group\">\r\n          <label class=\"form-control-label\">Limit number of toasts:</label>\r\n          <input class=\"form-control\" type=\"number\" [(ngModel)]=\"toastsLimit\" name=\"limit\">\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"form-control-label\">Toast type:</label>\r\n          <div class=\"dropdown\" ngbDropdown>\r\n            <button class=\"btn btn-primary\" type=\"button\" ngbDropdownToggle>\r\n              {{ type }}\r\n            </button>\r\n            <ul ngbDropdown class=\"dropdown-menu\">\r\n              <li class=\"dropdown-item\" *ngFor=\"let t of types\" (click)=\"type = t\">{{ t }}</li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n\r\n        <div><nb-checkbox [(ngModel)]=\"isNewestOnTop\">Newest on top</nb-checkbox></div>\r\n        <div><nb-checkbox [(ngModel)]=\"isHideOnClick\">Hide on click</nb-checkbox></div>\r\n        <div><nb-checkbox [(ngModel)]=\"isDuplicatesPrevented\">Prevent arising of duplicate toast</nb-checkbox></div>\r\n        <div><nb-checkbox [(ngModel)]=\"isCloseButton\">Close button</nb-checkbox></div>\r\n      </div>\r\n    </div>\r\n  </nb-card-body>\r\n\r\n  <nb-card-footer>\r\n    <button class=\"btn btn-primary\" (click)=\"makeToast()\">Show toast</button>\r\n    <button class=\"btn btn-success\" (click)=\"openRandomToast()\">Random toast</button>\r\n    <button class=\"btn btn-danger\" (click)=\"clearToasts()\">Clear all toasts</button>\r\n  </nb-card-footer>\r\n</nb-card>\r\n";

/***/ }),

/***/ "./src/app/pages/components/notifications/notifications.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * This is a starting point where we declare the maps of themes and globally available functions/mixins\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * This mixin generates keyfames.\n * Because of all keyframes can't be scoped,\n * we need to puts unique name in each btn-pulse call.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * This mixin generates keyfames.\n * Because of all keyframes can't be scoped,\n * we need to puts unique name in each btn-pulse call.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * This mixin generates keyfames.\n * Because of all keyframes can't be scoped,\n * we need to puts unique name in each btn-pulse call.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * This mixin generates keyfames.\n * Because of all keyframes can't be scoped,\n * we need to puts unique name in each btn-pulse call.\n */\n.blockquote {\n  padding: .5rem 1rem; }\n\n.user-context-menu {\n  border-width: 1px !important;\n  -webkit-box-shadow: 0 0px 12px 0 #e8e8e8;\n          box-shadow: 0 0px 12px 0 #e8e8e8; }\n\nnb-card {\n  border: 1px solid #eeeeee; }\n\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n:host-context(.nb-theme-default) {\n  /* stylelint-disable */\n  /* stylelint-enable */ }\n  :host-context(.nb-theme-default) nb-card-footer {\n    padding-bottom: 0.25rem; }\n    :host-context(.nb-theme-default) nb-card-footer button {\n      margin: 0 1rem 1rem 0; }\n  :host-context(.nb-theme-default) toaster-container /deep/ #toast-container .toast-close-button {\n    right: 0; }\n  @media (max-width: 399px) {\n    :host-context(.nb-theme-default) .dropdown-toggle {\n      font-size: 0.75rem; } }\n\n:host-context(.nb-theme-cosmic) {\n  /* stylelint-disable */\n  /* stylelint-enable */ }\n  :host-context(.nb-theme-cosmic) nb-card-footer {\n    padding-bottom: 0.25rem; }\n    :host-context(.nb-theme-cosmic) nb-card-footer button {\n      margin: 0 1rem 1rem 0; }\n  :host-context(.nb-theme-cosmic) toaster-container /deep/ #toast-container .toast-close-button {\n    right: 0; }\n  @media (max-width: 399px) {\n    :host-context(.nb-theme-cosmic) .dropdown-toggle {\n      font-size: 0.75rem; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "./src/app/pages/components/notifications/notifications.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_toaster__ = __webpack_require__("./node_modules/angular2-toaster/angular2-toaster.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_style_loader_angular2_toaster_toaster_css__ = __webpack_require__("./node_modules/style-loader/index.js!./node_modules/angular2-toaster/toaster.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_style_loader_angular2_toaster_toaster_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_style_loader_angular2_toaster_toaster_css__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NotificationsComponent = (function () {
    function NotificationsComponent(toasterService) {
        this.toasterService = toasterService;
        this.position = 'toast-top-right';
        this.animationType = 'fade';
        this.title = 'HI there!';
        this.content = "I'm cool toaster!";
        this.timeout = 5000;
        this.toastsLimit = 5;
        this.type = 'default';
        this.isNewestOnTop = true;
        this.isHideOnClick = true;
        this.isDuplicatesPrevented = false;
        this.isCloseButton = true;
        this.types = ['default', 'info', 'success', 'warning', 'error'];
        this.animations = ['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
        this.positions = ['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center',
            'toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];
        this.quotes = [
            { title: null, body: 'We rock at <i>Angular</i>' },
            { title: null, body: 'Titles are not always needed' },
            { title: null, body: 'Toastr rock!' },
            { title: 'What about nice html?', body: '<b>Sure you <em>can!</em></b>' },
        ];
    }
    NotificationsComponent.prototype.makeToast = function () {
        this.showToast(this.type, this.title, this.content);
    };
    NotificationsComponent.prototype.openRandomToast = function () {
        var typeIndex = Math.floor(Math.random() * this.types.length);
        var quoteIndex = Math.floor(Math.random() * this.quotes.length);
        var type = this.types[typeIndex];
        var quote = this.quotes[quoteIndex];
        this.showToast(type, quote.title, quote.body);
    };
    NotificationsComponent.prototype.showToast = function (type, title, body) {
        this.config = new __WEBPACK_IMPORTED_MODULE_1_angular2_toaster__["b" /* ToasterConfig */]({
            positionClass: this.position,
            timeout: this.timeout,
            newestOnTop: this.isNewestOnTop,
            tapToDismiss: this.isHideOnClick,
            preventDuplicates: this.isDuplicatesPrevented,
            animation: this.animationType,
            limit: this.toastsLimit,
        });
        var toast = {
            type: type,
            title: title,
            body: body,
            timeout: this.timeout,
            showCloseButton: this.isCloseButton,
            bodyOutputType: __WEBPACK_IMPORTED_MODULE_1_angular2_toaster__["a" /* BodyOutputType */].TrustedHtml,
        };
        this.toasterService.popAsync(toast);
    };
    NotificationsComponent.prototype.clearToasts = function () {
        this.toasterService.clear();
    };
    NotificationsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'ngx-notifications',
            styles: [__webpack_require__("./src/app/pages/components/notifications/notifications.component.scss")],
            template: __webpack_require__("./src/app/pages/components/notifications/notifications.component.html"),
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angular2_toaster__["d" /* ToasterService */]])
    ], NotificationsComponent);
    return NotificationsComponent;
}());



/***/ }),

/***/ "./src/app/pages/components/tree/tree.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n  <div class=\"col-md-6\">\r\n    <nb-card>\r\n      <nb-card-header>Tree</nb-card-header>\r\n      <nb-card-body>\r\n        <tree [tree]=\"tree\"></tree>\r\n      </nb-card-body>\r\n    </nb-card>\r\n  </div>\r\n</div>\r\n";

/***/ }),

/***/ "./src/app/pages/components/tree/tree.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TreeComponent = (function () {
    function TreeComponent() {
        this.tree = {
            value: 'Programming languages by programming paradigm',
            children: [{
                    value: 'Object-oriented programming',
                    children: [{
                            value: 'Java',
                        }, {
                            value: 'C++',
                        }, {
                            value: 'C#',
                        }],
                }, {
                    value: 'Prototype-based programming',
                    children: [{
                            value: 'JavaScript',
                        }, {
                            value: 'CoffeeScript',
                        }, {
                            value: 'Lua',
                        }],
                }],
        };
    }
    TreeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'ngx-tree',
            template: __webpack_require__("./src/app/pages/components/tree/tree.component.html"),
        })
    ], TreeComponent);
    return TreeComponent;
}());



/***/ })

});
//# sourceMappingURL=components.module.chunk.js.map
//# sourceMappingURL=components.module.chunk.js.map