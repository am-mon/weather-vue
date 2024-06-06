<template>
    <div class="container bg-success-subtle bg-gradient p-md-5 px-3 py-5">
        <h1 class="mb-5 text-success">Search Current Weather</h1>
        <form @submit.prevent="handleSubmit" class="row text-start mb-4" novalidate>
            <div class="col-12 col-md-5 my-1">
                <input type="text" class="form-control w-100 py-3" placeholder="Enter Country Code"
                    v-model="form.country" id="country" />
                <p v-if="form_errors.country" class="mt-2">{{ form_errors.country }}</p>
            </div>
            <div class="col-12 col-md-5 my-1">
                <input type="text" class="form-control w-100 py-3" placeholder="Enter City" v-model="form.city"
                    id="city" />
                <p v-if="form_errors.city" class="mt-2">{{ form_errors.city }}</p>
            </div>
            <div class="col-12 col-md-2 my-1">
                <button type="submit" class="form-control w-100 py-3 btn bg-success text-white fw-bold">Submit</button>
            </div>
        </form>

        <div v-if="loading">Loading...</div>
        <div v-else-if="error" style="color: #ff0000;">Error: {{ error.message }}</div>
        <div v-else>
            <div v-if="data">
                <div class="bg-white mt-3 rounded overflow-hidden">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div
                                class="py-3 py-md-4 bg-success text-white w-100 h-100 d-flex flex-column justify-content-center">
                                <h4 class="text-capitalize fw-light">{{ data.name }},
                                    <span class="text-uppercase">{{ data.sys?.country }}</span>
                                </h4>
                                <p>
                                    {{ this.getDynamicCountryTime(this.data.timezone) }}
                                </p>
                                <h4 class="fw-bold">
                                    {{ (data.main?.temp - 273.15).toFixed(1) }}°C ,&nbsp;
                                    {{ (((data.main?.temp - 273.15) * 9) / 5 + 32).toFixed(1) }}
                                    °F
                                </h4>
                                <div>
                                    <img style="max-width: 100px;"
                                        :src="'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png'" />
                                    <h6 class="text-capitalize fw-bold">
                                        {{ data.weather && data.weather[0].description }}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 py-3 py-md-4 d-flex flex-column justify-content-center"
                            style="font-size: 20px;">
                            <p>
                                <font-awesome-icon :icon="['fas', 'tint']" style="font-size: 24px;" class="me-2" />
                                <strong>Humidity:</strong>&nbsp;
                                {{ data.main?.humidity }}%
                            </p>
                            <p>
                                <font-awesome-icon :icon=" ['fas', 'tachometer-alt' ]" style="font-size: 24px;"
                                    class="me-2" />
                                <strong>Pressure:</strong>&nbsp;
                                {{ data.main?.pressure }} hPa
                            </p>
                            <p>
                                <font-awesome-icon :icon="['fas', 'wind']" style="font-size: 24px;" class="me-2" />
                                <strong className="text-gray-500">Wind:</strong>&nbsp;
                                {{ (data.wind?.speed * 3.6).toFixed(1) }} km/h
                            </p>
                        </div>
                    </div>
                    <!-- <pre style="margin-top:30px; text-align: left;">{{ data }}</pre> -->
                </div>
            </div>
        </div>


        <div class="mt-5 pt-4" v-if="fetchHistory.length">
            <h2 class="mb-4">Search History</h2>
            <div class="text-end">
                <button class="btn text-white" style="background-color: #333333;" @click="clearAllHistoryItem()">
                    <font-awesome-icon :icon="['fas', 'eraser']" class="me-2" />
                    Clear All
                </button>
            </div>

            <ul style="list-style: none;" class="p-0">
                <li class="mb-3" v-for="(entry, index) in fetchHistory.slice().reverse()" :key="index">
                    <!-- <strong>{{ entry.date }}</strong>: {{ entry.city }}, {{ entry.country }} - <span
                        :class="{ 'text-success': entry.success, 'text-danger': !entry.success }">{{ entry.status
                        }}</span> -->
                    <!-- <div>{{ entry }}</div> -->
                    <div class="bg-white mt-3 rounded overflow-hidden">
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="py-3 py-md-4 w-100 h-100 d-flex flex-column justify-content-center text-white"
                                    style="background-color: #708090;">
                                    <h4 class="text-white text-capitalize fw-light">
                                        {{ entry.city }}, <span class="text-uppercase"> {{ entry.country }}</span>
                                    </h4>
                                    <div v-if="entry.weather_data">
                                        <p>
                                            {{ entry.TimeZoneDate }}
                                        </p>
                                        <h4 class="text-white fw-bold">
                                            {{ (entry.weather_data.main?.temp - 273.15).toFixed(1) }}°C ,&nbsp;
                                            {{ (((entry.weather_data.main?.temp - 273.15) * 9) / 5 +
                                            32).toFixed(1) }}°F
                                        </h4>
                                        <div>
                                            <img style="max-width: 100px;"
                                                :src="'https://openweathermap.org/img/wn/' + entry.weather_data.weather[0].icon + '@4x.png'" />
                                            <h6 class="text-capitalize fw-bold">
                                                {{ entry.weather_data.weather &&
                                                entry.weather_data.weather[0].description
                                                }}
                                            </h6>
                                        </div>
                                        <!-- <div class="bg_weather_icon"
                                            :style="{ 
                                                'background-image': 'url(https://openweathermap.org/img/wn/' + entry.weather_data.weather[0].icon + '@4x.png)'}">
                                            <h6 class="text-capitalize fw-bold">
                                                {{ entry.weather_data.weather && entry.weather_data.weather[0].description
                                                }}
                                            </h6>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 pt-4 pb-5 py-md-4 d-flex flex-column justify-content-center"
                                style="position: relative;">
                                <button class="btn text-white"
                                    style="position: absolute; bottom: 10px; right: 20px; background-color: #708090;"
                                    @click="removeHistoryItem(entry)">
                                    <font-awesome-icon :icon="['fas', 'trash']" class="me-2" />
                                    Delete
                                </button>
                                <div v-if="entry.weather_data" style="font-size: 20px;">
                                    <p>
                                        <font-awesome-icon :icon="['fas', 'tint']" style="font-size: 24px;"
                                            class="me-2" />
                                        <strong>Humidity:</strong>&nbsp;
                                        {{ entry.weather_data.main?.humidity }}%
                                    </p>
                                    <p>
                                        <font-awesome-icon :icon=" ['fas', 'tachometer-alt' ]" style="font-size: 24px;"
                                            class="me-2" />
                                        <strong>Pressure:</strong>&nbsp;
                                        {{ entry.weather_data.main?.pressure }} hPa
                                    </p>
                                    <p>
                                        <font-awesome-icon :icon="['fas', 'wind']" style="font-size: 24px;"
                                            class="me-2" />
                                        <strong className="text-gray-500">Wind:</strong>&nbsp;
                                        {{ (entry.weather_data.wind?.speed * 3.6).toFixed(1) }} km/h
                                    </p>
                                </div>
                                <div v-else>
                                    <p><strong>{{ entry.status}}!</strong></p>
                                    <p>No data to show due to <br>incorrect city or country code.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>


        <p class="mt-5 text-center">This site is developed by using Vue.js for a learning purpose.</p>
        <p class="text-center">Copyright © {{ new Date().getFullYear() }} Mon. All Rights Reserved.</p>
    </div>
</template>

<script>
export default {
    name: "HomePage",
    data() {
        return {
            form: {
                city: '',
                country: '',
            },
            form_errors: {},
            api_key: "1baf41538ffb1d7b4b5560b86ccc414b",
            data: null,
            loading: false,
            error: null,
            fetchHistory: [],
        }
    },
    created() {
        // Load fetch history from local storage when the component is created
        const storedHistory = localStorage.getItem('fetchHistory');
        if (storedHistory) {
            this.fetchHistory = JSON.parse(storedHistory);
        }
    },
    methods: {
        
        async handleSubmit() {
            this.form_errors = {};
            this.error = '';
            this.data = ''

            if (!this.form.city) {
                this.form_errors.city = 'City is required';
            }

            if (!this.form.country) {
                this.form_errors.country = 'Country Code is required';
            }

            if (Object.keys(this.form_errors).length === 0) {
                this.loading = true;

                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?q=${this.form.city},${this.form.country}&appid=${this.api_key}`
                    );
                    if (!response.ok) {
                        throw new Error('Please enter the correct details.');
                    }
                    const result = await response.json();
                    this.data = result;
                    console.log(this.data);
                    this.addFetchHistory(this.form.city, this.form.country, 'Success', true);

                } catch (err) {
                    this.error = err;
                    console.log(err);
                    // this.addFetchHistory(this.form.city, this.form.country, 'Failed', false);
                } finally {
                    this.loading = false;
                }
                this.resetForm();
            }
            
        },
        resetForm() {
            this.form = {
                city: '',
                country: '',
            };
            this.form_errors = {};
        },
        getDynamicCountryTime(responseTimezone) {
            const date = new Date();
            
            const year = date.getFullYear();
            const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const month = month_names[date.getMonth()];
            const date_only = date.getDate();

            const days = { weekday: "long" };
            const dayOfWeek = date.toLocaleString("en-US", days);

            const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
            const timeOffset = responseTimezone / 3600;
            const target_time = new Date(utcTime + 3600000 * timeOffset);
            const am_pm_time = target_time.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
            return year + ' ' + month + ' ' + date_only + ', ' + dayOfWeek + ' ' + am_pm_time;
        },
        addFetchHistory(city, country, status, success) {
            const entry = {
                date: new Date().toLocaleString(),
                TimeZoneDate: this.getDynamicCountryTime(this.data.timezone), 
                city,
                country,
                status,
                success,
                weather_data: this.data
            };
            this.fetchHistory.push(entry);
            localStorage.setItem('fetchHistory', JSON.stringify(this.fetchHistory));
        },
        removeHistoryItem(itemToRemove) {
            this.fetchHistory = this.fetchHistory.filter(entry => entry !== itemToRemove);
            localStorage.setItem('fetchHistory', JSON.stringify(this.fetchHistory));
        },
        clearAllHistoryItem() {
            this.fetchHistory = [];
            localStorage.setItem('fetchHistory', JSON.stringify(this.fetchHistory));
        }
    },
}
</script>

<style>
.bg_weather_icon {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}
</style>