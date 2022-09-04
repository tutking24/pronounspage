<template>
    <div :class="['modal', shown ? 'd-block' : '', shownFull ? 'modal-shown' : '']" @click="hideClick">
        <div :class="['modal-dialog', 'modal-dialog-centered', 'modal-dialog-scrollable', size ? 'modal-' + size : '']" role="document">
            <div class="modal-content shadow">
                <div class="modal-header" v-if="header">
                    <p class="h5 modal-title">
                        <Icon v-if="icon" :v="icon"/>
                        {{header}}
                    </p>
                </div>
                <div class="modal-body" v-if="message">
                    <p :class="[margin ? 'py-5 text-center' : '']" v-html="message"></p>
                </div>
                <div class="modal-body" v-if="value !== undefined">
                    <ListInput v-if="Array.isArray(value)" v-model="value" v-slot="s">
                        <textarea v-model="s.val" class="form-control" rows="5" @keyup="s.update(s.val)" @update="s.update(s.val)"></textarea>
                    </ListInput>
                    <textarea v-else v-model="value" class="form-control" rows="5"></textarea>
                </div>
                <div v-if="choice" class="modal-footer">
                    <button class="btn btn-outline-dark" @click="cancel">
                        {{$t('confirm.no')}}
                    </button>
                    <button :class="'btn btn-' + (color || 'primary')" @click="confirm">
                        {{$t('confirm.yes')}}
                    </button>
                </div>
                <div v-else-if="value !== undefined" class="modal-footer">
                    <button class="btn btn-outline-dark" @click="cancel">
                        {{$t('confirm.dismiss')}}
                    </button>
                    <button :class="'btn btn-' + (color || 'primary')" @click="confirm">
                        {{$t('confirm.save')}}
                    </button>
                </div>
                <div v-else class="modal-footer">
                    <button :class="'btn btn-' + (color || 'primary')" @click="confirm">
                        {{$t('confirm.ok')}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                shown: false,
                shownFull: false,
                choice: false,
                icon: undefined,
                header: undefined,
                message: undefined,
                margin: true,
                color: null,
                value: undefined,
                size: undefined,
                resolve: undefined,
                reject: undefined,
            }
        },
        mounted() {
            if (process.client) {
                window.addEventListener('keydown', e => {
                    if (!this.shown) {
                        return;
                    }

                    if (e.keyCode === 27) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.cancel();
                    } else if (e.keyCode === 13) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.confirm();
                    }
                });
            }
        },
        methods: {
            show(choice, message, color, value, size, resolve, reject) {
                this.choice = choice;
                if (typeof(message) === 'string') {
                    message = { message };
                }
                this.icon = message.icon || (choice ? 'map-marker-question' : null);
                this.header = message.header;
                this.message = message.message || (choice ? this.$t('confirm.header') : null);
                this.margin = message.margin ?? true;
                this.size = message.size ?? size;
                this.color = color;
                this.value = value;
                this.shown = true;
                this.resolve = resolve;
                this.reject = reject;
                requestAnimationFrame(() => this.shownFull = true);
            },
            confirm() {
                const resolve = this.resolve;
                this.hide();
                if (resolve) {
                    resolve(this.value);
                }
            },
            cancel(event) {
                const reject = this.reject;
                this.hide();
                if (reject) {
                    reject();
                }
            },
            hide() {
                this.shownFull = false;
                setTimeout(() => {
                    this.shown = false;
                    this.choice = false;
                    this.icon = undefined;
                    this.header = undefined;
                    this.message = undefined;
                    this.margin = true;
                    this.color = null;
                    this.value = undefined;
                    this.size = undefined;
                    this.resolve = undefined;
                    this.reject = undefined;
                }, 500);
            },
            hideClick(event) {
                if (event.target === this.$el) {
                    this.cancel();
                }
            },
        },
    };
</script>
