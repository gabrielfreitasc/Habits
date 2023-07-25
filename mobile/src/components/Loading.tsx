import { ActivityIndicator, View } from "react-native"

export function Loading() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090A' }}>
            <ActivityIndicator color="#00c5c6" />
        </View>
    )
}

export default Loading