import { Injectable } from '@angular/core';
import { SpinnerComponent } from '../../common/spinner.component';

@Injectable()
export class SpinnerService {
    private spinnerCache = new Set<SpinnerComponent>();

    _register(spinner: SpinnerComponent): void {
        this.spinnerCache.add(spinner);
    }

    show(): void {
        this.spinnerCache.forEach(spinner => {
            spinner.loading = true;
        });
    }

    hide(): void {
        this.spinnerCache.forEach(spinner => {
            spinner.loading = false;
        });
    }
}